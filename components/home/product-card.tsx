import Link from "next/link"
import { Flame } from "lucide-react"

import type { Product } from "@/lib/dummyjson"
import { getSystemDiscount, getDiscountedPrice } from "@/lib/discounts"
import { cn, formatPrice } from "@/lib/utils"
import { StarRating } from "@/components/star-rating"
import { ProductImage } from "@/components/product-image"
import { ProductCardFavorite } from "@/components/products/product-card-favorite"

function ProductCard({
  product,
  fill = false,
  size = "default",
}: {
  product: Product
  fill?: boolean
  size?: "default" | "lg"
}) {
  const discount = getSystemDiscount(product.discountPercentage, product.stock)
  const hasDiscount = discount > 0
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage,
    product.stock
  )
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock >= 1 && product.stock < 10
  const large = size === "lg"

  // Small ("default") cards — homepage carousels + related-products — get a
  // slight bump above mobile. Large ("lg") shop-grid cards keep their own scale.
  const badgeBase = cn(
    "rounded-full px-2 py-0.5 text-xs font-semibold",
    large ? "lg:px-2.5 lg:py-1 lg:text-sm" : "sm:px-2.5 sm:py-1 sm:text-sm"
  )

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3",
        fill ? "w-full" : "w-48 shrink-0 sm:w-64"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted">
        <Link
          href={`/products/${product.id}`}
          aria-label={product.title}
          tabIndex={-1}
          className="absolute inset-0"
        >
          <ProductImage
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 256px, 192px"
            className={cn(
              "object-contain p-6 transition-transform duration-300 group-hover:scale-105",
              isOutOfStock && "opacity-50 grayscale"
            )}
          />
        </Link>

        <div className="pointer-events-none absolute top-2 left-2 z-10 flex flex-col items-start gap-1.5">
          {hasDiscount && (
            <span className={cn(badgeBase, "bg-foreground text-background")}>
              -{discount}%
            </span>
          )}
          {isOutOfStock ? (
            <span className={cn(badgeBase, "bg-foreground text-background")}>
              Out of Stock
            </span>
          ) : (
            isLowStock && (
              <span
                className={cn(
                  badgeBase,
                  "inline-flex items-center gap-1 border border-foreground bg-background text-foreground"
                )}
              >
                <Flame
                  className={cn(
                    "size-3",
                    large ? "lg:size-3.5" : "sm:size-3.5"
                  )}
                  aria-hidden="true"
                />
                {product.stock} left
              </span>
            )
          )}
        </div>

        <ProductCardFavorite product={product} large={large} />
      </div>

      <Link
        href={`/products/${product.id}`}
        className="flex flex-col gap-1.5"
      >
        <p
          className={cn(
            "line-clamp-1 text-sm font-medium text-foreground group-hover:underline",
            large && "lg:text-base"
          )}
        >
          {product.title}
        </p>
        <div className="flex items-center gap-1.5">
          <StarRating
            rating={product.rating}
            starClassName={cn("size-3.5", large && "lg:size-4")}
          />
          <span
            className={cn(
              "text-xs text-muted-foreground",
              large && "lg:text-sm"
            )}
          >
            {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-lg font-bold text-foreground",
              large && "lg:text-xl"
            )}
          >
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && (
            <span
              className={cn(
                "text-sm text-muted-foreground line-through",
                large && "lg:text-base"
              )}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}

export { ProductCard }
