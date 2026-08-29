"use client"

import * as React from "react"

import { useShopPending } from "@/components/shop/shop-pending-context"
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton"

// Wraps the product grid (or the "no results" message). `resultsKey` is a
// string derived from the current filters/sort/page — when the server sends
// down a NEW key (meaning fresh results actually arrived), that's the signal
// to clear the pending flag and reveal the real content again.
//
// The clear happens in a layout effect rather than during render: clearing
// pending updates state owned by ShopPendingProvider (an ancestor), and
// updating a different component's state during render is unsupported in
// React. useLayoutEffect still runs before the browser paints, so there's
// no visible flicker — it just isn't literally "during render".
function ShopResultsGate({
  resultsKey,
  children,
}: {
  resultsKey: string
  children: React.ReactNode
}) {
  const { pending, clearPending } = useShopPending()
  const lastKeyRef = React.useRef(resultsKey)

  React.useLayoutEffect(() => {
    if (lastKeyRef.current !== resultsKey) {
      lastKeyRef.current = resultsKey
      clearPending()
    }
  }, [resultsKey, clearPending])

  if (pending) {
    return <ProductGridSkeleton />
  }

  return <>{children}</>
}

export { ShopResultsGate }
