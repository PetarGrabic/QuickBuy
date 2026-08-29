"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"

import { getSystemDiscount, getDiscountedPrice } from "@/lib/discounts"
import { formatPrice } from "@/lib/utils"
import { useCart, maxQuantityFor, type CartItem } from "@/lib/cart/cart-context"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
} from "@/components/ui/tooltip"

function CartLineItem({ item }: { item: CartItem }) {
  const { items, setQuantity, removeItem, restoreItem } = useCart()

  const discount = getSystemDiscount(item.discountPercentage, item.stock)
  const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage, item.stock)
  const lineTotal = discountedPrice * item.quantity
  const cap = maxQuantityFor(item.stock)

  function handleRemove() {
    const index = items.findIndex((i) => i.id === item.id)
    let undone = false
    removeItem(item.id)
    const toastId = toast.add({
      title: "Removed from cart",
      description: item.title,
      type: "info",
      timeout: 5000,
      actionProps: {
        children: "Undo",
        onClick: () => {
          if (undone) return
          undone = true
          restoreItem(item, index)
          toast.close(toastId)
        },
      },
    })
  }

  return (
    <div className="group/media flex gap-4 border-b border-border py-6 last:border-b-0">
      <Link
        href={`/products/${item.id}`}
        className="relative aspect-square size-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:size-32"
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="(min-width: 640px) 128px, 112px"
          className="object-contain p-3"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Link
              href={`/products/${item.id}`}
              className="text-base font-semibold text-foreground group-hover/media:underline sm:text-lg"
            >
              {item.title}
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(discountedPrice)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(item.price)}
                  </span>
                  <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label={`Remove ${item.title} from cart`}
                  className="shrink-0 rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                />
              }
            >
              <Trash2 className="size-4" />
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipPositioner>
                <TooltipPopup>Remove from cart</TooltipPopup>
              </TooltipPositioner>
            </TooltipPortal>
          </Tooltip>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex h-9 items-center rounded-md border border-border">
            <button
              type="button"
              onClick={() => setQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex size-9 items-center justify-center text-foreground disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= cap}
              className="flex size-9 items-center justify-center text-foreground disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Subtotal</span>
            <span className="text-lg font-bold text-foreground">
              {formatPrice(lineTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CartLineItem }
