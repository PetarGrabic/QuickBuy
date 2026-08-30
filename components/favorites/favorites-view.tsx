"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import type { Product } from "@/lib/products"
import { useAuth } from "@/lib/auth/auth-context"
import { useFavorites } from "@/lib/favorites/favorites-context"
import { supabaseAuth } from "@/lib/auth/supabase-client"
import { runAuthedQuery } from "@/lib/auth/query"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/home/product-card"
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton"

interface RemoteFavoriteProduct {
  id: number
  title: string
  price: number
  discount_percentage: number
  rating: number
  thumbnail: string
  category: string
  brand: string | null
  stock: number
}

async function loadFavoriteProducts(userId: string): Promise<Product[]> {
  const { data, error } = await runAuthedQuery(
    () =>
      supabaseAuth
        .from("favorites")
        .select(
          "product_id, products!inner(id, title, price, discount_percentage, rating, thumbnail, category, brand, stock)"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    "favorite products load"
  )
  if (error || !data) return []
  return data.map((row) => {
    const p = row.products as unknown as RemoteFavoriteProduct
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      discountPercentage: p.discount_percentage,
      rating: p.rating,
      thumbnail: p.thumbnail,
      category: p.category,
      brand: p.brand,
      stock: p.stock,
    }
  })
}

const GRID_CLASS =
  "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"

function FavoritesView() {
  const { user, loading: authLoading } = useAuth()
  const { isFavorite } = useFavorites()
  const router = useRouter()

  const [products, setProducts] = React.useState<Product[]>([])
  const [fetched, setFetched] = React.useState(false)

  const hadUserRef = React.useRef(false)
  React.useEffect(() => {
    if (user) hadUserRef.current = true
  }, [user])

  // Client-side gate (the app has no middleware). A guest who arrived here is
  // sent to log in; a user who just logged out — or whose session expired —
  // goes home, matching the account menu's log-out → homepage behaviour.
  React.useEffect(() => {
    if (authLoading || user) return
    router.replace(hadUserRef.current ? "/" : "/login?next=/favorites")
  }, [authLoading, user, router])

  React.useEffect(() => {
    const uid = user?.id
    if (!uid) return
    let cancelled = false
    setFetched(false)
    void (async () => {
      const list = await loadFavoriteProducts(uid)
      if (cancelled) return
      setProducts(list)
      setFetched(true)
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  if (authLoading || !user || !fetched) {
    return (
      <div>
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted sm:h-9" />
        <div className="mt-6">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    )
  }

  // Filter by the live favorites set so unfavoriting a card removes it here.
  const visible = products.filter((p) => isFavorite(p.id))

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 pt-16 pb-12 text-center sm:pt-24">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          No favorites yet
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Tap the heart on any product to save it here for later.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/shop" />}
          className="mt-2 sm:h-10 sm:px-6 sm:text-base lg:h-12 lg:px-8"
        >
          Start Shopping
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-nowrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-bold whitespace-nowrap text-foreground sm:text-3xl">
          Your Favorites ({visible.length})
        </h1>
        <Link
          href="/shop"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground hover:underline sm:gap-1.5 sm:text-base"
        >
          Continue Shopping
          <ArrowRight className="size-3.5 sm:size-4" />
        </Link>
      </div>

      <div className={`mt-6 ${GRID_CLASS}`}>
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} fill size="lg" />
        ))}
      </div>
    </div>
  )
}

export { FavoritesView }
