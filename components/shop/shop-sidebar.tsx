"use client"

import Link from "next/link"
import { Tag, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { cn } from "@/lib/utils"
import { buildShopHref, type ShopParams } from "@/lib/shop-url"
import type { Category } from "@/lib/products"
import { useShopPending } from "@/components/shop/shop-pending-context"

const RATINGS = [4, 3, 2]

function RatingFilterLink({
  href,
  active,
  count,
  children,
}: {
  href: string
  active: boolean
  count: number
  children: React.ReactNode
}) {
  const { markPending } = useShopPending()
  return (
    <Link
      href={href}
      onClick={markPending}
      className={cn(
        "flex items-center justify-between rounded-md px-2 py-1.5 text-sm",
        active
          ? "bg-muted font-semibold text-foreground"
          : "text-foreground hover:bg-muted"
      )}
    >
      {children}
      <span className="text-xs text-muted-foreground">({count})</span>
    </Link>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-sm font-semibold text-foreground">{children}</h3>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  const { markPending } = useShopPending()
  return (
    <Link
      href={href}
      onClick={markPending}
      className={cn(
        "rounded-md px-2 py-1.5 text-left text-sm",
        active
          ? "bg-muted font-semibold text-foreground"
          : "text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  )
}

function DealRow({
  href,
  active,
  icon: Icon,
  title,
  description,
}: {
  href: string
  active: boolean
  icon: typeof Tag
  title: string
  description: string
}) {
  const { markPending } = useShopPending()
  return (
    <Link
      href={href}
      onClick={markPending}
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
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
    </Link>
  )
}

function PriceInput({
  name,
  placeholder,
  defaultValue,
  clearHref,
}: {
  name: string
  placeholder: string
  defaultValue?: string
  clearHref: string
}) {
  return (
    <div className="relative flex-1">
      <input
        type="number"
        name={name}
        min={0}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="h-9 w-full min-w-0 rounded-md border border-border bg-background px-2 pr-7 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {defaultValue && (
        <Link
          href={clearHref}
          aria-label={`Clear ${placeholder.toLowerCase()} price`}
          className="absolute top-1/2 right-1.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          ×
        </Link>
      )}
    </div>
  )
}

function ShopSidebar({
  categories,
  searchParams,
  ratingCounts,
  allRatingsCount,
}: {
  categories: Category[]
  searchParams: ShopParams
  ratingCounts: Record<number, number>
  allRatingsCount: number
}) {
  const { markPending } = useShopPending()
  const activeRating = searchParams.minRating
  const discountedActive = searchParams.discounted === "1"
  const lowStockActive = searchParams.lowStock === "1"

  const resetHref = searchParams.q
    ? `/shop?q=${encodeURIComponent(searchParams.q)}`
    : "/shop"

  return (
    <aside className="flex shrink-0 flex-col gap-8 lg:w-64">
      <div>
        <SectionHeading>Special Offers</SectionHeading>
        <div className="flex flex-col gap-2">
          <DealRow
            href={buildShopHref(searchParams, {
              discounted: discountedActive ? undefined : "1",
            })}
            active={discountedActive}
            icon={Tag}
            title="On Sale"
            description="See discounted items"
          />
          <DealRow
            href={buildShopHref(searchParams, {
              lowStock: lowStockActive ? undefined : "1",
            })}
            active={lowStockActive}
            icon={Zap}
            title="Low Stock"
            description="Going fast — grab it now"
          />
        </div>
      </div>

      <div>
        <SectionHeading>Category</SectionHeading>
        <div className="flex flex-col gap-0.5">
          <FilterLink
            href={buildShopHref(searchParams, { category: undefined })}
            active={!searchParams.category}
          >
            All Categories
          </FilterLink>
          <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
            {categories.map((category) => (
              <FilterLink
                key={category.slug}
                href={buildShopHref(searchParams, {
                  category: category.slug,
                })}
                active={searchParams.category === category.slug}
              >
                {category.name}
              </FilterLink>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionHeading>Price</SectionHeading>
        <form
          method="get"
          action="/shop"
          className="flex flex-col gap-2 px-2"
        >
          <div className="flex items-center gap-2">
            <PriceInput
              name="minPrice"
              placeholder="Min"
              defaultValue={searchParams.minPrice}
              clearHref={buildShopHref(searchParams, { minPrice: undefined })}
            />
            <span className="text-muted-foreground">–</span>
            <PriceInput
              name="maxPrice"
              placeholder="Max"
              defaultValue={searchParams.maxPrice}
              clearHref={buildShopHref(searchParams, { maxPrice: undefined })}
            />
          </div>
          {searchParams.category && (
            <input type="hidden" name="category" value={searchParams.category} />
          )}
          {searchParams.minRating && (
            <input type="hidden" name="minRating" value={searchParams.minRating} />
          )}
          {searchParams.discounted && (
            <input type="hidden" name="discounted" value={searchParams.discounted} />
          )}
          {searchParams.lowStock && (
            <input type="hidden" name="lowStock" value={searchParams.lowStock} />
          )}
          {searchParams.sort && (
            <input type="hidden" name="sort" value={searchParams.sort} />
          )}
          {searchParams.q && (
            <input type="hidden" name="q" value={searchParams.q} />
          )}
          <Button type="submit" variant="outline" size="sm">
            Apply
          </Button>
        </form>
      </div>

      <div>
        <SectionHeading>Rating</SectionHeading>
        <div className="flex flex-col gap-0.5">
          <RatingFilterLink
            href={buildShopHref(searchParams, { minRating: undefined })}
            active={!activeRating}
            count={allRatingsCount}
          >
            All Ratings
          </RatingFilterLink>
          {RATINGS.map((rating) => (
            <RatingFilterLink
              key={rating}
              href={buildShopHref(searchParams, {
                minRating: String(rating),
              })}
              active={activeRating === String(rating)}
              count={ratingCounts[rating] ?? 0}
            >
              <StarRating rating={rating} starClassName="size-3.5" />
            </RatingFilterLink>
          ))}
        </div>
      </div>

      <Link
        href={resetHref}
        onClick={markPending}
        className="rounded-md bg-foreground px-4 py-2.5 text-center text-sm font-semibold text-background hover:bg-foreground/90"
      >
        Reset Filters
      </Link>
    </aside>
  )
}

export { ShopSidebar }
