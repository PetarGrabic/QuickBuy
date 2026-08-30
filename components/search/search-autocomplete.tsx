"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, History, Search, Tag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/product-image"
import { useShopPending } from "@/components/shop/shop-pending-context"
import {
  cn,
  formatCategoryName,
  formatPrice,
  truncateForDisplay,
} from "@/lib/utils"
import { searchProducts, type Category, type Product } from "@/lib/products"
import { useRecents } from "@/lib/recent/recents-context"

const DEBOUNCE_MS = 250
const MAX_CATEGORY_MATCHES = 3
const MAX_PRODUCT_MATCHES = 3
const MAX_QUERY_LENGTH = 100
const MAX_QUERY_DISPLAY_LENGTH = 40

// Recent-product tiles stretch to fill the full width of the search bar —
// this is the smallest a tile is allowed to shrink to before an extra
// column is dropped, and the row's own horizontal padding (p-2 = 8px/side).
const RECENT_PRODUCT_MIN_TILE = 72
const RECENT_PRODUCT_GAP = 8
const RECENT_PRODUCT_ROW_PADDING = 16

// Hard ceiling on how many recent-product tiles are ever shown, on top of
// however many fit by width — tuned per viewport-width tier (mobile/tablet/
// desktop), not the search bar's own (often capped) rendered width.
const TABLET_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1024
const MAX_RECENT_PRODUCTS_MOBILE = 4
const MAX_RECENT_PRODUCTS_TABLET = 5
const MAX_RECENT_PRODUCTS_DESKTOP = 6

const SEARCH_INPUT_CLASS =
  "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"

function rowClass(keyboardActive: boolean) {
  return cn(
    "flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted",
    keyboardActive && "bg-muted ring-2 ring-inset ring-foreground"
  )
}

function SearchAutocomplete({
  categories,
  variant,
  onNavigate,
  trailing,
  defaultQuery = "",
  compact = false,
}: {
  categories: Category[]
  variant: "hero" | "mobile"
  onNavigate?: () => void
  trailing?: React.ReactNode
  defaultQuery?: string
  compact?: boolean
}) {
  const router = useRouter()
  const { markPending } = useShopPending()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [query, setQuery] = React.useState(defaultQuery)
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [products, setProducts] = React.useState<Product[]>([])
  const [resolvedQuery, setResolvedQuery] = React.useState("")
  const [keyboardIndex, setKeyboardIndex] = React.useState(-1)
  const {
    recentSearches,
    recentProducts,
    addRecentSearch,
    removeRecentSearch,
    addRecentProduct,
    removeRecentProduct,
  } = useRecents()
  const [containerWidth, setContainerWidth] = React.useState(0)
  const [viewportWidth, setViewportWidth] = React.useState(0)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setViewportWidth(entries[0]?.contentRect.width ?? 0)
    })
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [query])

  React.useEffect(() => {
    if (!debouncedQuery) return

    const controller = new AbortController()

    searchProducts(debouncedQuery, MAX_PRODUCT_MATCHES, controller.signal)
      .then((results) => {
        setProducts(results)
        setResolvedQuery(debouncedQuery)
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") {
          setProducts([])
          setResolvedQuery(debouncedQuery)
        }
      })

    return () => controller.abort()
  }, [debouncedQuery])

  const visibleProducts = debouncedQuery ? products : []
  const showLoading = Boolean(debouncedQuery) && resolvedQuery !== debouncedQuery

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const matchedCategories = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return categories
      .filter((category) => category.name.toLowerCase().includes(q))
      .slice(0, MAX_CATEGORY_MATCHES)
  }, [categories, query])

  const trimmedQuery = query.trim()
  const isRecentMode = trimmedQuery.length === 0
  const recentSearchLimit = variant === "mobile" ? 3 : 4
  const availableRowWidth = Math.max(
    0,
    containerWidth - RECENT_PRODUCT_ROW_PADDING
  )
  const recentProductWidthFit =
    containerWidth > 0
      ? Math.max(
          1,
          Math.floor(
            (availableRowWidth + RECENT_PRODUCT_GAP) /
              (RECENT_PRODUCT_MIN_TILE + RECENT_PRODUCT_GAP)
          )
        )
      : variant === "mobile"
        ? 3
        : 4
  const maxRecentProductsForScreen =
    viewportWidth > 0
      ? viewportWidth >= DESKTOP_BREAKPOINT
        ? MAX_RECENT_PRODUCTS_DESKTOP
        : viewportWidth >= TABLET_BREAKPOINT
          ? MAX_RECENT_PRODUCTS_TABLET
          : MAX_RECENT_PRODUCTS_MOBILE
      : variant === "mobile"
        ? MAX_RECENT_PRODUCTS_MOBILE
        : MAX_RECENT_PRODUCTS_DESKTOP
  const recentProductSlots = Math.min(
    recentProductWidthFit,
    maxRecentProductsForScreen
  )
  const visibleRecentSearches = recentSearches.slice(0, recentSearchLimit)
  const visibleRecentProducts = recentProducts.slice(0, recentProductSlots)
  const showDropdown =
    dropdownOpen &&
    (trimmedQuery.length > 0 ||
      visibleRecentSearches.length > 0 ||
      visibleRecentProducts.length > 0)
  const footerIndex = matchedCategories.length + visibleProducts.length
  const itemCount = footerIndex + 1

  function hrefForIndex(index: number): string {
    if (index < matchedCategories.length) {
      return `/shop?category=${matchedCategories[index].slug}`
    }
    const productIndex = index - matchedCategories.length
    if (productIndex < visibleProducts.length) {
      return `/products/${visibleProducts[productIndex].id}`
    }
    return `/shop?q=${encodeURIComponent(query.trim())}`
  }

  function navigateTo(index: number) {
    if (index < matchedCategories.length) {
      addRecentSearch(query)
    } else {
      const productIndex = index - matchedCategories.length
      const product = visibleProducts[productIndex]
      if (product) {
        addRecentProduct({
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
        })
      } else {
        addRecentSearch(query)
      }
    }
    markPending()
    router.push(hrefForIndex(index))
    setDropdownOpen(false)
    onNavigate?.()
  }

  function selectRecentSearch(item: string) {
    addRecentSearch(item)
    markPending()
    router.push(`/shop?q=${encodeURIComponent(item)}`)
    setDropdownOpen(false)
    onNavigate?.()
  }

  function handleRemoveRecentSearch(
    item: string,
    event: React.MouseEvent | React.KeyboardEvent
  ) {
    event.preventDefault()
    event.stopPropagation()
    removeRecentSearch(item)
  }

  function handleRemoveRecentProduct(
    id: number,
    event: React.MouseEvent | React.KeyboardEvent
  ) {
    event.preventDefault()
    event.stopPropagation()
    removeRecentProduct(id)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setDropdownOpen(false)
      onNavigate?.()
      return
    }
    if (!showDropdown) return

    const count = isRecentMode ? visibleRecentSearches.length : itemCount

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setKeyboardIndex((i) => Math.min(i + 1, count - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setKeyboardIndex((i) => Math.max(i - 1, -1))
    } else if (event.key === "Enter") {
      if (isRecentMode) {
        if (keyboardIndex < 0) return
        event.preventDefault()
        selectRecentSearch(visibleRecentSearches[keyboardIndex])
      } else {
        event.preventDefault()
        navigateTo(keyboardIndex >= 0 ? keyboardIndex : footerIndex)
      }
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!query.trim()) return
    navigateTo(keyboardIndex >= 0 ? keyboardIndex : footerIndex)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
    setKeyboardIndex(-1)
    setDropdownOpen(true)
  }

  function handleClear() {
    setQuery("")
    setKeyboardIndex(-1)
    inputRef.current?.focus()
  }

  const input = (
    <input
      ref={inputRef}
      type="search"
      value={query}
      onChange={handleChange}
      onFocus={() => setDropdownOpen(true)}
      onKeyDown={handleKeyDown}
      autoFocus={variant === "mobile"}
      maxLength={MAX_QUERY_LENGTH}
      placeholder={
        variant === "hero"
          ? "Search for products or categories..."
          : "Search products..."
      }
      className={cn(
        SEARCH_INPUT_CLASS,
        variant === "hero"
          ? cn(
              "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
              compact ? "h-10 pl-4 text-sm" : "h-12 pl-5 text-base"
            )
          : "h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      )}
    />
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        variant === "mobile" && "flex flex-1 items-center gap-2"
      )}
    >
      {variant === "hero" ? (
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex items-center gap-1 rounded-full border border-border bg-background",
            compact ? "p-1.5 shadow-md" : "p-2 shadow-2xl"
          )}
        >
          {input}
          {query.length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
                compact ? "size-7" : "size-8"
              )}
            >
              <X className={compact ? "size-3.5" : "size-4"} />
            </button>
          )}
          <Button
            type="submit"
            size={compact ? "icon" : "icon-lg"}
            className={cn("rounded-full", compact ? "size-9" : "size-12")}
            aria-label="Search"
          >
            <Search className={compact ? "size-4" : "size-5"} />
          </Button>
        </form>
      ) : (
        <>
          {input}
          {trailing}
        </>
      )}

      {showDropdown && (
        <div
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 rounded-xl border border-border bg-background shadow-2xl"
        >
          {isRecentMode ? (
            <>
              {visibleRecentSearches.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Recent Searches
                  </p>
                  {visibleRecentSearches.map((item, i) => (
                    <div
                      key={item}
                      role="option"
                      aria-selected={keyboardIndex === i}
                      className={rowClass(keyboardIndex === i)}
                    >
                      <Link
                        href={`/shop?q=${encodeURIComponent(item)}`}
                        onClick={() => {
                          addRecentSearch(item)
                          setDropdownOpen(false)
                          onNavigate?.()
                        }}
                        className="flex min-w-0 flex-1 items-center gap-3"
                      >
                        <History className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate">
                          {item}
                        </span>
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove "${item}" from recent searches`}
                        onClick={(event) =>
                          handleRemoveRecentSearch(item, event)
                        }
                        className="flex shrink-0 items-center justify-center rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {visibleRecentSearches.length > 0 &&
                visibleRecentProducts.length > 0 && (
                  <div className="mx-2 border-t border-border" />
                )}

              {visibleRecentProducts.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Recent Products
                  </p>
                  <div className="flex gap-2">
                    {visibleRecentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="relative aspect-square min-w-0 max-w-32 flex-1"
                      >
                        <Link
                          href={`/products/${product.id}`}
                          onClick={() => {
                            addRecentProduct(product)
                            setDropdownOpen(false)
                            onNavigate?.()
                          }}
                          className="relative block size-full overflow-hidden rounded-md border border-border bg-muted"
                        >
                          <ProductImage
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            sizes="(min-width: 768px) 112px, 96px"
                            className="object-contain p-2"
                          />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove "${product.title}" from recent products`}
                          onClick={(event) =>
                            handleRemoveRecentProduct(product.id, event)
                          }
                          className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {matchedCategories.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Categories
                  </p>
                  {matchedCategories.map((category, i) => (
                    <Link
                      key={category.slug}
                      href={`/shop?category=${category.slug}`}
                      role="option"
                      aria-selected={keyboardIndex === i}
                      onClick={() => {
                        addRecentSearch(query)
                        setDropdownOpen(false)
                        onNavigate?.()
                      }}
                      className={rowClass(keyboardIndex === i)}
                    >
                      <Tag className="size-4 text-muted-foreground" />
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {matchedCategories.length > 0 &&
                (visibleProducts.length > 0 || showLoading) && (
                  <div className="mx-2 border-t border-border" />
                )}

              {(visibleProducts.length > 0 || showLoading) && (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Products
                  </p>
                  {visibleProducts.length === 0 && showLoading ? (
                    <p className="px-2 py-2 text-sm text-muted-foreground">
                      Searching…
                    </p>
                  ) : (
                    visibleProducts.map((product, i) => {
                      const index = matchedCategories.length + i
                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          role="option"
                          aria-selected={keyboardIndex === index}
                          onClick={() => {
                            addRecentProduct({
                              id: product.id,
                              title: product.title,
                              thumbnail: product.thumbnail,
                            })
                            setDropdownOpen(false)
                            onNavigate?.()
                          }}
                          className={rowClass(keyboardIndex === index)}
                        >
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            <ProductImage
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-foreground">
                              {product.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {formatCategoryName(product.category)}
                            </p>
                          </div>
                          <span className="shrink-0 font-semibold text-foreground">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      )
                    })
                  )}
                </div>
              )}

              {!showLoading &&
                matchedCategories.length === 0 &&
                visibleProducts.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm break-words text-muted-foreground">
                    No results found for &quot;
                    {truncateForDisplay(
                      debouncedQuery,
                      MAX_QUERY_DISPLAY_LENGTH
                    )}
                    &quot;
                  </p>
                )}

              <Link
                href={`/shop?q=${encodeURIComponent(query.trim())}`}
                role="option"
                aria-selected={keyboardIndex === footerIndex}
                onClick={() => {
                  addRecentSearch(query)
                  setDropdownOpen(false)
                  onNavigate?.()
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border-t border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted",
                  keyboardIndex === footerIndex &&
                    "bg-muted ring-2 ring-inset ring-foreground"
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  View all results for &quot;
                  {truncateForDisplay(query.trim(), MAX_QUERY_DISPLAY_LENGTH)}
                  &quot;
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export { SearchAutocomplete }
