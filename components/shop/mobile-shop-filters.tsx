"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SlidersHorizontal, Tag, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { cn } from "@/lib/utils"
import { buildShopHref, type ShopParams } from "@/lib/shop-url"
import type { Category } from "@/lib/dummyjson"
import { StarRating } from "@/components/star-rating"
import { useShopPending } from "@/components/shop/shop-pending-context"

const RATINGS = [4, 3, 2]

interface CategoryItem {
  value: string
  label: string
}

function ToggleRow({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Tag
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-foreground hover:bg-muted"
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border",
          active
            ? "border-background bg-background text-foreground"
            : "border-foreground text-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-bold">{title}</span>
        <span
          className={cn(
            "text-xs",
            active ? "text-background/70" : "text-muted-foreground"
          )}
        >
          {description}
        </span>
      </span>
    </button>
  )
}

function MobileShopFilters({
  categories,
  searchParams,
  activeCount,
}: {
  categories: Category[]
  searchParams: ShopParams
  activeCount: number
}) {
  const router = useRouter()
  const { markPending } = useShopPending()
  const [open, setOpen] = React.useState(false)

  const categoryItems = React.useMemo<CategoryItem[]>(
    () => categories.map((c) => ({ value: c.slug, label: c.name })),
    [categories]
  )

  const [category, setCategory] = React.useState(searchParams.category ?? "")
  const [minPrice, setMinPrice] = React.useState(searchParams.minPrice ?? "")
  const [maxPrice, setMaxPrice] = React.useState(searchParams.maxPrice ?? "")
  const [minRating, setMinRating] = React.useState(
    searchParams.minRating ?? ""
  )
  const [discounted, setDiscounted] = React.useState(
    searchParams.discounted === "1"
  )
  const [lowStock, setLowStock] = React.useState(
    searchParams.lowStock === "1"
  )

  const [prevOpen, setPrevOpen] = React.useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setCategory(searchParams.category ?? "")
      setMinPrice(searchParams.minPrice ?? "")
      setMaxPrice(searchParams.maxPrice ?? "")
      setMinRating(searchParams.minRating ?? "")
      setDiscounted(searchParams.discounted === "1")
      setLowStock(searchParams.lowStock === "1")
    }
  }

  const selectedCategoryItem =
    categoryItems.find((c) => c.value === category) ?? null

  function handleApply() {
    markPending()
    router.push(
      buildShopHref(searchParams, {
        category: category || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        minRating: minRating || undefined,
        discounted: discounted ? "1" : undefined,
        lowStock: lowStock ? "1" : undefined,
      })
    )
    setOpen(false)
  }

  function handleReset() {
    markPending()
    router.push(
      searchParams.q ? `/shop?q=${encodeURIComponent(searchParams.q)}` : "/shop"
    )
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button variant="outline" className="flex-1 justify-center gap-2">
            <SlidersHorizontal className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                {activeCount}
              </span>
            )}
          </Button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">
              Category
            </p>
            <Combobox
              items={categoryItems}
              value={selectedCategoryItem}
              onValueChange={(item) =>
                setCategory((item as CategoryItem | null)?.value ?? "")
              }
            >
              <ComboboxInput placeholder="All Categories" showClear />
              <ComboboxContent>
                <ComboboxEmpty>No categories found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: CategoryItem) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">
              Price
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-9 w-full min-w-0 rounded-md border border-border bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <span className="text-muted-foreground">–</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-9 w-full min-w-0 rounded-md border border-border bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">
              Rating
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMinRating("")}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm",
                  !minRating
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground"
                )}
              >
                All
              </button>
              {RATINGS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(String(r))}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1.5",
                    minRating === String(r)
                      ? "border-foreground bg-foreground"
                      : "border-border"
                  )}
                >
                  <StarRating
                    rating={r}
                    starClassName="size-3.5"
                    filledClassName={
                      minRating === String(r)
                        ? "fill-background text-background"
                        : "fill-foreground text-foreground"
                    }
                    emptyClassName={
                      minRating === String(r)
                        ? "text-background/40"
                        : "text-muted-foreground"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">
              Special Offers
            </p>
            <div className="flex flex-col gap-2">
              <ToggleRow
                active={discounted}
                onClick={() => setDiscounted((v) => !v)}
                icon={Tag}
                title="On Sale"
                description="See discounted items"
              />
              <ToggleRow
                active={lowStock}
                onClick={() => setLowStock((v) => !v)}
                icon={Zap}
                title="Low Stock"
                description="Going fast — grab it now"
              />
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button type="button" className="flex-1" onClick={handleApply}>
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export { MobileShopFilters }
