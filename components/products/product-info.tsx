import { Flame } from "lucide-react"

import type { ProductDetail } from "@/lib/products"
import { getDiscountedPrice } from "@/lib/discounts"
import { formatPrice } from "@/lib/utils"
import { StarRating } from "@/components/star-rating"
import { AddToCart } from "@/components/products/add-to-cart"
import { FavoriteButton } from "@/components/products/favorite-button"

function ProductInfo({ product }: { product: ProductDetail }) {
  const discount = product.discountPercentage
  const hasDiscount = discount > 0
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage
  )
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock >= 1 && product.stock < 10

  return (
    <div className="flex flex-col gap-3 md:gap-5">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        {product.title}
      </h1>

      <div className="flex items-center gap-1.5">
        <StarRating rating={product.rating} starClassName="size-4" />
        <span className="text-sm text-muted-foreground">
          {product.rating.toFixed(1)} ({product.reviews.length}{" "}
          {product.reviews.length === 1 ? "review" : "reviews"})
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-3xl font-bold text-foreground">
          {formatPrice(discountedPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
            <span className="rounded-full bg-foreground px-3 py-1 text-sm font-bold text-background">
              -{discount}% OFF
            </span>
          </>
        )}
      </div>

      {isOutOfStock ? (
        <span className="inline-flex w-fit items-center rounded-full bg-foreground px-3 py-1 text-sm font-bold text-background">
          Out of Stock
        </span>
      ) : isLowStock ? (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1 text-sm font-bold text-foreground">
          <Flame className="size-4" />
          Only {product.stock} left in stock
        </span>
      ) : (
        <p className="text-sm text-muted-foreground">In Stock</p>
      )}

      <p className="order-2 text-sm leading-relaxed text-muted-foreground sm:order-none mt-2 sm:mt-0">
        {product.description}
      </p>

      <div className="order-1 mt-1 flex items-center gap-2 sm:order-none sm:gap-3">
        <AddToCart
          product={product}
          maxQuantity={Math.min(product.stock, 10)}
        />
        <FavoriteButton productId={product.id} />
      </div>
    </div>
  )
}

export { ProductInfo }
