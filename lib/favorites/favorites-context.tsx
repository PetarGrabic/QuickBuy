"use client"

import * as React from "react"

import { useAuth } from "@/lib/auth/auth-context"
import { supabaseAuth } from "@/lib/auth/supabase-client"
import { runAuthedQuery } from "@/lib/auth/query"
import { takePendingFavorite } from "@/lib/favorites/pending-favorite"

interface FavoritesContextValue {
  /** Whether this product is in the signed-in user's favorites. */
  isFavorite: (productId: number) => boolean
  /** Add/remove a favorite (no-op for guests — the UI shows a login prompt). */
  toggleFavorite: (productId: number) => void
  /** True while the initial favorites list is loading for a signed-in user. */
  loading: boolean
}

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null)

async function loadFavoriteIds(userId: string): Promise<number[]> {
  const { data, error } = await runAuthedQuery(
    () =>
      supabaseAuth
        .from("favorites")
        .select("product_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    "favorites load"
  )
  if (error) return []
  return (data ?? []).map((r) => r.product_id)
}

function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [favoriteIds, setFavoriteIds] = React.useState<Set<number>>(
    () => new Set()
  )
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (authLoading) return
    const uid = user?.id ?? null

    if (!uid) {
      setFavoriteIds(new Set())
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    void (async () => {
      const ids = await loadFavoriteIds(uid)
      if (cancelled) return

      // A guest who pressed the heart then logged in: apply that intent now.
      const pending = takePendingFavorite()
      if (pending != null && !ids.includes(pending)) {
        const { error } = await supabaseAuth
          .from("favorites")
          .upsert(
            { user_id: uid, product_id: pending },
            { onConflict: "user_id,product_id" }
          )
        if (cancelled) return
        if (!error) {
          setFavoriteIds(new Set([pending, ...ids]))
          setLoading(false)
          return
        }
        console.error("pending favorite apply failed", error)
      }

      setFavoriteIds(new Set(ids))
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, authLoading])

  const userId = user?.id ?? null

  const value = React.useMemo<FavoritesContextValue>(
    () => ({
      loading,
      isFavorite: (productId) => favoriteIds.has(productId),
      toggleFavorite: (productId) => {
        if (!userId) return // guests don't have favorites

        const wasFavorite = favoriteIds.has(productId)
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          if (wasFavorite) next.delete(productId)
          else next.add(productId)
          return next
        })

        const onDone = ({ error }: { error: unknown }) => {
          if (!error) return
          console.error("favorite toggle failed", error)
          // Roll the optimistic change back.
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            if (wasFavorite) next.add(productId)
            else next.delete(productId)
            return next
          })
        }

        if (wasFavorite) {
          void supabaseAuth
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", productId)
            .then(onDone)
        } else {
          void supabaseAuth
            .from("favorites")
            .upsert(
              { user_id: userId, product_id: productId },
              { onConflict: "user_id,product_id" }
            )
            .then(onDone)
        }
      },
    }),
    [favoriteIds, loading, userId]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

function useFavorites() {
  const ctx = React.useContext(FavoritesContext)
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider")
  return ctx
}

export { FavoritesProvider, useFavorites }
