"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/cart/cart-context"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { CartLineItem } from "@/components/cart/cart-line-item"

const DOT_SIZE = 3
const DOT_GAP = 5
const DOT_PITCH = DOT_SIZE + DOT_GAP

function DotLeader() {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const width = el.clientWidth
      setCount(Math.max(2, Math.floor((width + DOT_GAP) / DOT_PITCH)))
    }

    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      className="mb-1.5 flex flex-1 items-center justify-between overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="size-[3px] shrink-0 rounded-full bg-muted-foreground/50" />
      ))}
    </span>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-end gap-2">
      <span>{label}</span>
      <DotLeader />
      <span>{value}</span>
    </div>
  )
}

function CartView() {
  const { items, itemCount, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex min-h-[calc(100dvh-7rem)] flex-col items-center gap-3 pt-12 text-center sm:min-h-0 sm:py-24">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Your cart is empty
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Start browsing to find
          something you like.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/shop" />}
          className="mt-2 sm:h-10 sm:px-6 sm:text-base lg:h-12 lg:px-8"
        >
          Start Shopping
        </Button>
      </div>
    )
  }

  const originalSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalDiscount = originalSubtotal - subtotal

  function handleCheckout() {
    toast.add({
      title: "Checkout isn't available yet",
      description: "We're still building this feature — check back soon.",
      type: "info",
      timeout: 4000,
    })
  }

  return (
    <div>
      <div className="flex flex-nowrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-bold whitespace-nowrap text-foreground sm:text-3xl">
          Your Cart ({itemCount})
        </h1>
        <Link
          href="/shop"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground hover:underline sm:gap-1.5 sm:text-base"
        >
          Continue Shopping
          <ArrowRight className="size-3.5 sm:size-4" />
        </Link>
      </div>

      <div className="mt-2 gap-4 sm:mt-6 grid sm:gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        <div>
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </div>

        <aside className="flex h-fit flex-col gap-5 rounded-xl border border-border p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
          <div className="flex flex-col gap-2 text-base text-muted-foreground">
            <SummaryRow label={`Items (${itemCount})`} value={formatPrice(originalSubtotal)} />
            {totalDiscount > 0 && (
              <SummaryRow label="Discount" value={`-${formatPrice(totalDiscount)}`} />
            )}
            <SummaryRow label="Shipping" value="Free" />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-5">
            <span className="text-lg font-bold text-foreground">Total</span>
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(subtotal)}
            </span>
          </div>
          <Button
            size="lg"
            className="w-full lg:h-12 lg:text-base"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </aside>
      </div>
    </div>
  )
}

export { CartView }
