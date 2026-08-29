import Link from "next/link"

import type { Product } from "@/lib/dummyjson"
import { getSystemDiscount, getDiscountedPrice } from "@/lib/discounts"
import { cn, formatPrice } from "@/lib/utils"
import { StarRating } from "@/components/star-rating"
import { ProductImage } from "@/components/product-image"

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

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group flex flex-col gap-3",
        fill ? "w-full" : "w-48 shrink-0 sm:w-64"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted">
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
        {hasDiscount && (
          <span
            className={cn(
              "absolute top-2 left-2 rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background",
              large && "lg:px-2.5 lg:py-1 lg:text-sm"
            )}
          >
            -{discount}%
          </span>
        )}
        {isOutOfStock ? (
          <span
            className={cn(
              "absolute top-2 right-2 rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background",
              large && "lg:px-2.5 lg:py-1 lg:text-sm"
            )}
          >
            Out of Stock
          </span>
        ) : (
          isLowStock && (
            <span
              className={cn(
                "absolute top-2 right-2 rounded-full border border-foreground bg-background px-2 py-0.5 text-xs font-semibold text-foreground",
                large && "lg:px-2.5 lg:py-1 lg:text-sm"
              )}
            >
              Only {product.stock} left
            </span>
          )
        )}
      </div>

      <div className="flex flex-col gap-1.5">
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
      </div>
    </Link>
  )
}

export { ProductCard }
