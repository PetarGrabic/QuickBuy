import { getCategories, getShopProducts } from "@/lib/dummyjson"
import { ProductCard } from "@/components/home/product-card"
import { ShopSidebar } from "@/components/shop/shop-sidebar"
import { ShopPagination } from "@/components/shop/shop-pagination"
import { ShopSearch } from "@/components/shop/shop-search"
import { ShopSortSelect } from "@/components/shop/shop-sort-select"
import { MobileShopFilters } from "@/components/shop/mobile-shop-filters"
import { ActiveFilterChips } from "@/components/shop/active-filter-chips"
import { cn, truncateForDisplay } from "@/lib/utils"
import type { ShopParams } from "@/lib/shop-url"
import type { ShopSort } from "@/lib/dummyjson"

// Fetched/paginated in fixed steps of 16 (the 4-column desktop count). The
// grid then CSS-hides the last item at <xl (3 columns) and the last two at
// <sm (2 columns), so each breakpoint's last row is always full instead of
// leaving a lonely orphan card.
const PAGE_SIZE = 16
const MAX_QUERY_DISPLAY_LENGTH = 40

async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const raw = await searchParams
  const params: ShopParams = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  )

  const page = Math.max(1, Number(params.page) || 1)
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const minRating = params.minRating ? Number(params.minRating) : undefined

  const [categories, { products, total, ratingCounts, allRatingsCount }] =
    await Promise.all([
      getCategories(),
      getShopProducts({
        query: params.q,
        category: params.category,
        minPrice,
        maxPrice,
        minRating,
        discountedOnly: params.discounted === "1",
        lowStockOnly: params.lowStock === "1",
        sort: params.sort as ShopSort | undefined,
        page,
        pageSize: PAGE_SIZE,
      }),
    ])

  const activeFilterCount = [
    Boolean(params.category),
    Boolean(params.minPrice || params.maxPrice),
    Boolean(params.minRating),
    params.discounted === "1",
    params.lowStock === "1",
  ].filter(Boolean).length

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, total)

  const displayQuery = params.q
    ? truncateForDisplay(params.q, MAX_QUERY_DISPLAY_LENGTH)
    : null

  const countText =
    total === 0
      ? displayQuery
        ? `No results for "${displayQuery}"`
        : "No products found"
      : displayQuery
        ? `Showing ${rangeStart}-${rangeEnd} of ${total} results for "${displayQuery}"`
        : `Showing ${rangeStart}-${rangeEnd} of ${total} products`

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-4 pb-10 sm:px-6 lg:px-10 lg:py-10 xl:px-14">
      <h1 className="sr-only">Shop</h1>

      <ShopSearch categories={categories} defaultQuery={params.q} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden lg:block">
          <ShopSidebar
            categories={categories}
            searchParams={params}
            ratingCounts={ratingCounts}
            allRatingsCount={allRatingsCount}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <MobileShopFilters
                categories={categories}
                searchParams={params}
                activeCount={activeFilterCount}
              />
              <ShopSortSelect searchParams={params} className="flex-1" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{countText}</p>
            <div className="mt-3">
              <ActiveFilterChips
                searchParams={params}
                categories={categories}
              />
            </div>
          </div>

          <div className="hidden items-center justify-between gap-4 lg:flex">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <p className="shrink-0 text-sm text-muted-foreground">
                {countText}
              </p>
              <ActiveFilterChips
                searchParams={params}
                categories={categories}
                maxVisible={3}
                wrap={false}
              />
            </div>
            <ShopSortSelect searchParams={params} className="shrink-0" />
          </div>

          <div className="mt-4 border-t border-border" />

          {products.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    index === 14 && "hidden sm:block",
                    index === 15 && "hidden xl:block"
                  )}
                >
                  <ProductCard product={product} fill size="lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[calc(100dvh-21rem)] sm:min-h-0">
              <p className="mt-16 text-center text-muted-foreground">
                No products match your filters.
              </p>
            </div>
          )}

          <div className="mt-10">
            <ShopPagination
              total={total}
              page={page}
              pageSize={PAGE_SIZE}
              searchParams={params}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage
