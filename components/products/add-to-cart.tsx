"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import type { ProductDetail } from "@/lib/dummyjson"
import { useCart } from "@/lib/cart/cart-context"
import { Button } from "@/components/ui/button"

function AddToCart({
  product,
  maxQuantity,
}: {
  product: ProductDetail
  maxQuantity: number
}) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = React.useState(1)
  const disabled = maxQuantity === 0

  function handleAdd() {
    addItem(
      {
        id: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
      },
      quantity
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex h-10 shrink-0 items-center rounded-md border border-border sm:h-11">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={disabled}
          className="flex size-10 items-center justify-center text-foreground disabled:opacity-50 sm:size-11"
          aria-label="Decrease quantity"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center text-sm font-medium text-foreground sm:w-8">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
          disabled={disabled}
          className="flex size-10 items-center justify-center text-foreground disabled:opacity-50 sm:size-11"
          aria-label="Increase quantity"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Button
        size="lg"
        className="h-10 px-6 text-base sm:h-11 sm:px-12"
        disabled={disabled}
        onClick={handleAdd}
      >
        {disabled ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  )
}

export { AddToCart }
