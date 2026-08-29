"use client"

import * as React from "react"

// Filter/sort/search links on the shop page navigate by changing the URL's
// search params on the SAME route. Unlike a cross-route navigation, Next.js
// does not show the route's loading.tsx Suspense fallback for a same-route
// search-param change — the page just sits frozen until the new data
// arrives. This context lets any filter/sort/search control mark a
// navigation as "in flight" the instant it's clicked, so the product grid
// can show a skeleton immediately instead of freezing with no feedback.
//
// The default value is a harmless no-op so components that use this context
// (e.g. SearchAutocomplete) can be safely rendered outside the shop page too.
interface ShopPendingContextValue {
  pending: boolean
  markPending: () => void
  clearPending: () => void
}

const noop = () => {}

const ShopPendingContext = React.createContext<ShopPendingContextValue>({
  pending: false,
  markPending: noop,
  clearPending: noop,
})

function ShopPendingProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = React.useState(false)
  const markPending = React.useCallback(() => setPending(true), [])
  const clearPending = React.useCallback(() => setPending(false), [])
  const value = React.useMemo(
    () => ({ pending, markPending, clearPending }),
    [pending, markPending, clearPending]
  )

  return (
    <ShopPendingContext.Provider value={value}>
      {children}
    </ShopPendingContext.Provider>
  )
}

function useShopPending() {
  return React.useContext(ShopPendingContext)
}

export { ShopPendingProvider, useShopPending }
