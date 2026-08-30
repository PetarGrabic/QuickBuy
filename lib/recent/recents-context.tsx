"use client"

import * as React from "react"

import { useAuth } from "@/lib/auth/auth-context"
import { supabaseAuth } from "@/lib/auth/supabase-client"
import { runAuthedQuery } from "@/lib/auth/query"
import {
  getRecentSearches,
  saveRecentSearches,
  clearRecentSearches,
  nextRecentSearches,
  removeRecentSearch as removeRecentSearchLocal,
  MAX_RECENT_SEARCHES,
} from "@/lib/recent-searches"
import {
  getRecentProducts,
  saveRecentProducts,
  clearRecentProducts,
  nextRecentProducts,
  removeRecentProduct as removeRecentProductLocal,
  MAX_RECENT_PRODUCTS,
  type RecentProduct,
} from "@/lib/recent-products"

interface RecentsContextValue {
  recentSearches: string[]
  recentProducts: RecentProduct[]
  addRecentSearch: (query: string) => void
  removeRecentSearch: (query: string) => void
  addRecentProduct: (product: RecentProduct) => void
  removeRecentProduct: (id: number) => void
}

const RecentsContext = React.createContext<RecentsContextValue | null>(null)

async function loadRemoteSearches(userId: string): Promise<string[]> {
  const { data, error } = await runAuthedQuery(
    () =>
      supabaseAuth
        .from("recent_searches")
        .select("query")
        .eq("user_id", userId)
        .order("searched_at", { ascending: false })
        .limit(MAX_RECENT_SEARCHES),
    "recent searches load"
  )
  if (error) return []
  return (data ?? []).map((r) => r.query)
}

async function loadRemoteProducts(userId: string): Promise<RecentProduct[]> {
  const { data, error } = await runAuthedQuery(
    () =>
      supabaseAuth
        .from("recent_products")
        .select("product_id, products!inner(title, thumbnail)")
        .eq("user_id", userId)
        .order("viewed_at", { ascending: false })
        .limit(MAX_RECENT_PRODUCTS),
    "recent products load"
  )
  if (error) return []
  return (data ?? []).map((r) => {
    const p = r.products as unknown as { title: string; thumbnail: string }
    return { id: r.product_id, title: p.title, thumbnail: p.thumbnail }
  })
}

async function mergeLocalRecentsIntoRemote(userId: string) {
  // De-dupe defensively: a single INSERT ... ON CONFLICT can't touch the same
  // conflict target twice (case-variant queries collapse to one query_key).
  const seenQ = new Set<string>()
  const localSearches = getRecentSearches().filter((q) => {
    const k = q.trim().toLowerCase()
    if (!k || seenQ.has(k)) return false
    seenQ.add(k)
    return true
  })
  const seenP = new Set<number>()
  const localProducts = getRecentProducts().filter((p) => {
    if (seenP.has(p.id)) return false
    seenP.add(p.id)
    return true
  })
  const base = Date.now()

  if (localSearches.length > 0) {
    const { error } = await supabaseAuth.from("recent_searches").upsert(
      // newest-first list -> descending timestamps
      localSearches.map((query, i) => ({
        user_id: userId,
        query,
        searched_at: new Date(base - i).toISOString(),
      })),
      { onConflict: "user_id,query_key" }
    )
    if (error) console.error("recent searches merge", error)
  }

  if (localProducts.length > 0) {
    const { error } = await supabaseAuth.from("recent_products").upsert(
      localProducts.map((p, i) => ({
        user_id: userId,
        product_id: p.id,
        viewed_at: new Date(base - i).toISOString(),
      })),
      { onConflict: "user_id,product_id" }
    )
    if (error) console.error("recent products merge", error)
  }

  clearRecentSearches()
  clearRecentProducts()
}

function RecentsProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() =>
    getRecentSearches()
  )
  const [recentProducts, setRecentProducts] = React.useState<RecentProduct[]>(
    () => getRecentProducts()
  )
  const prevUserIdRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (authLoading) return
    const uid = user?.id ?? null
    const prev = prevUserIdRef.current
    prevUserIdRef.current = uid

    if (!uid) {
      if (prev) {
        setRecentSearches(getRecentSearches())
        setRecentProducts(getRecentProducts())
      }
      return
    }

    let cancelled = false
    void (async () => {
      if (!prev) await mergeLocalRecentsIntoRemote(uid)
      const [searches, products] = await Promise.all([
        loadRemoteSearches(uid),
        loadRemoteProducts(uid),
      ])
      if (cancelled) return
      setRecentSearches(searches)
      setRecentProducts(products)
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, authLoading])

  const userId = user?.id ?? null

  const value = React.useMemo<RecentsContextValue>(
    () => ({
      recentSearches,
      recentProducts,
      addRecentSearch: (query) => {
        const trimmed = query.trim()
        if (!trimmed) return
        setRecentSearches((prev) => nextRecentSearches(prev, trimmed))
        if (userId) {
          void supabaseAuth
            .from("recent_searches")
            .upsert(
              {
                user_id: userId,
                query: trimmed,
                searched_at: new Date().toISOString(),
              },
              { onConflict: "user_id,query_key" }
            )
            .then(({ error }) => {
              if (error) console.error("recent search upsert", error)
            })
        } else {
          saveRecentSearches(nextRecentSearches(getRecentSearches(), trimmed))
        }
      },
      removeRecentSearch: (query) => {
        setRecentSearches((prev) => prev.filter((q) => q !== query))
        if (userId) {
          void supabaseAuth
            .from("recent_searches")
            .delete()
            .eq("user_id", userId)
            .eq("query_key", query.toLowerCase())
            .then(({ error }) => {
              if (error) console.error("recent search delete", error)
            })
        } else {
          removeRecentSearchLocal(query)
        }
      },
      addRecentProduct: (product) => {
        setRecentProducts((prev) => nextRecentProducts(prev, product))
        if (userId) {
          void supabaseAuth
            .from("recent_products")
            .upsert(
              {
                user_id: userId,
                product_id: product.id,
                viewed_at: new Date().toISOString(),
              },
              { onConflict: "user_id,product_id" }
            )
            .then(({ error }) => {
              if (error) console.error("recent product upsert", error)
            })
        } else {
          saveRecentProducts(nextRecentProducts(getRecentProducts(), product))
        }
      },
      removeRecentProduct: (id) => {
        setRecentProducts((prev) => prev.filter((p) => p.id !== id))
        if (userId) {
          void supabaseAuth
            .from("recent_products")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", id)
            .then(({ error }) => {
              if (error) console.error("recent product delete", error)
            })
        } else {
          removeRecentProductLocal(id)
        }
      },
    }),
    [recentSearches, recentProducts, userId]
  )

  return (
    <RecentsContext.Provider value={value}>{children}</RecentsContext.Provider>
  )
}

function useRecents() {
  const ctx = React.useContext(RecentsContext)
  if (!ctx) throw new Error("useRecents must be used within a RecentsProvider")
  return ctx
}

export { RecentsProvider, useRecents }
