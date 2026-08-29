"use client"

import Link from "next/link"
import { X } from "lucide-react"

import { cn, truncateForDisplay } from "@/lib/utils"
import { buildShopHref, type ShopParams } from "@/lib/shop-url"
import type { Category } from "@/lib/dummyjson"
import { useShopPending } from "@/components/shop/shop-pending-context"

const DEFAULT_MAX_VISIBLE_CHIPS = 4
const MAX_QUERY_DISPLAY_LENGTH = 30

interface Chip {
  key: string
  label: string
  removeHref: string
}

function buildChips(
  searchParams: ShopParams,
  categories: Category[]
): Chip[] {
  const chips: Chip[] = []

  if (searchParams.q) {
    chips.push({
      key: "q",
      label: `Search: "${truncateForDisplay(searchParams.q, MAX_QUERY_DISPLAY_LENGTH)}"`,
      removeHref: buildShopHref(searchParams, { q: undefined }),
    })
  }

  if (searchParams.category) {
    const category = categories.find((c) => c.slug === searchParams.category)
    chips.push({
      key: "category",
      label: category?.name ?? searchParams.category,
      removeHref: buildShopHref(searchParams, { category: undefined }),
    })
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    const { minPrice, maxPrice } = searchParams
    const label =
      minPrice && maxPrice
        ? `$${minPrice} – $${maxPrice}`
        : minPrice
          ? `$${minPrice} & up`
          : `Up to $${maxPrice}`
    chips.push({
      key: "price",
      label: `Price: ${label}`,
      removeHref: buildShopHref(searchParams, {
        minPrice: undefined,
        maxPrice: undefined,
      }),
    })
  }

  if (searchParams.minRating) {
    chips.push({
      key: "rating",
      label: `${searchParams.minRating}★ & up`,
      removeHref: buildShopHref(searchParams, { minRating: undefined }),
    })
  }

  if (searchParams.discounted === "1") {
    chips.push({
      key: "discounted",
      label: "On Sale",
      removeHref: buildShopHref(searchParams, { discounted: undefined }),
    })
  }

  if (searchParams.lowStock === "1") {
    chips.push({
      key: "lowStock",
      label: "Low Stock",
      removeHref: buildShopHref(searchParams, { lowStock: undefined }),
    })
  }

  return chips
}

function ActiveFilterChips({
  searchParams,
  categories,
  maxVisible = DEFAULT_MAX_VISIBLE_CHIPS,
  wrap = true,
}: {
  searchParams: ShopParams
  categories: Category[]
  maxVisible?: number
  wrap?: boolean
}) {
  const { markPending } = useShopPending()
  const chips = buildChips(searchParams, categories)
  if (chips.length === 0) return null

  const visible = chips.slice(0, maxVisible)
  const hiddenCount = chips.length - visible.length

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        wrap ? "flex-wrap" : "min-w-0 flex-nowrap overflow-hidden"
      )}
    >
      {visible.map((chip) => (
        <Link
          key={chip.key}
          href={chip.removeHref}
          onClick={markPending}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground hover:bg-muted/70"
        >
          {chip.label}
          <X className="size-3" />
        </Link>
      ))}
      {hiddenCount > 0 && (
        <span className="shrink-0 text-xs text-muted-foreground">
          +{hiddenCount} more
        </span>
      )}
    </div>
  )
}

export { ActiveFilterChips }
