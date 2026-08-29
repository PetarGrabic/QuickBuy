"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, CircleCheck } from "lucide-react"

import { cn, formatPrice } from "@/lib/utils"
import { getSystemDiscount, getDiscountedPrice } from "@/lib/discounts"
import { useCart } from "@/lib/cart/cart-context"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from "@/components/ui/popover"

const DISMISS_MS = 4000

function CartButton({ className }: { className?: string }) {
  const { itemCount, subtotal, lastAdded } = useCart()
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function scheduleClose() {
    clearTimer()
    timerRef.current = setTimeout(() => setOpen(false), DISMISS_MS)
  }

  React.useEffect(() => clearTimer, [])

  React.useEffect(
    () => {
      if (!lastAdded) return
      const el = triggerRef.current
      if (!el || el.offsetParent === null) return
      setOpen(true)
      scheduleClose()
    },
    // Only re-run when a new "add to cart" happens, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastAdded]
  )

  function handleOpenChange(next: boolean) {
    // Opening only ever happens programmatically (see the effect above) when
    // a new item is added — clicking the trigger itself should just navigate
    // to /cart, not pop this back open showing stale "last added" info.
    if (next) return
    setOpen(false)
    clearTimer()
  }

  const discount = lastAdded
    ? getSystemDiscount(lastAdded.discountPercentage, lastAdded.stock)
    : 0
  const unitPrice = lastAdded
    ? getDiscountedPrice(lastAdded.price, lastAdded.discountPercentage, lastAdded.stock)
    : 0

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <Button
            ref={triggerRef}
            variant="outline"
            size="icon"
            className={cn("relative", className)}
            aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : "Cart"}
            nativeButton={false}
            render={<Link href="/cart" />}
          />
        }
      >
        <ShoppingCart />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-bold text-background">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="center">
          <PopoverPopup onMouseEnter={clearTimer} onMouseLeave={scheduleClose}>
            {lastAdded && (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CircleCheck className="size-4" />
                  Added to cart
                </div>

                <div className="mt-3 flex gap-3 border-b border-border pb-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={lastAdded.thumbnail}
                      alt={lastAdded.title}
                      fill
                      sizes="56px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {lastAdded.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(unitPrice)}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(lastAdded.price)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Quantity: {lastAdded.quantityAdded}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {itemCount} {itemCount === 1 ? "item" : "items"} in cart
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Button
                  className="mt-3 w-full"
                  nativeButton={false}
                  render={<Link href="/cart" />}
                  onClick={() => setOpen(false)}
                >
                  Go to Cart
                </Button>
              </>
            )}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  )
}

export { CartButton }
