"use client"

import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buildShopHref, type ShopParams } from "@/lib/shop-url"
import type { ShopSort } from "@/lib/dummyjson"
import { useShopPending } from "@/components/shop/shop-pending-context"

const SORT_OPTIONS: { value: ShopSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
  { value: "title-asc", label: "Name: A to Z" },
  { value: "title-desc", label: "Name: Z to A" },
]

function ShopSortSelect({
  searchParams,
  className,
}: {
  searchParams: ShopParams
  className?: string
}) {
  const router = useRouter()
  const { markPending } = useShopPending()
  const value: ShopSort = (searchParams.sort as ShopSort | undefined) ?? "featured"

  function handleValueChange(next: unknown) {
    const sort = next as ShopSort
    markPending()
    router.push(
      buildShopHref(searchParams, { sort: sort === "featured" ? undefined : sort })
    )
  }

  return (
    <Select items={SORT_OPTIONS} value={value} onValueChange={handleValueChange}>
      <SelectTrigger className={className} aria-label="Sort products">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ShopSortSelect }
