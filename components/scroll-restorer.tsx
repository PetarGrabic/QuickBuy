"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { takeReturnScroll } from "@/lib/scroll-restore"

// Restores the scroll position saved by `rememberReturnScroll()` once the app
// navigates (back) to the matching URL — e.g. after a guest logs in and is
// returned to the product/shop page they were on.
function ScrollRestorer() {
  const pathname = usePathname()

  React.useEffect(() => {
    const here = window.location.pathname + window.location.search
    const y = takeReturnScroll(here)
    if (y == null) return
    // Wait for the destination page to lay out before scrolling.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => window.scrollTo(0, y))
    )
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return null
}

export { ScrollRestorer }
