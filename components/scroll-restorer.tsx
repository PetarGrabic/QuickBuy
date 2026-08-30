"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { takeReturnScroll } from "@/lib/scroll-restore"

// How long to keep re-asserting the target scroll position after arriving, so
// late-laying-out content (images, carousels, web fonts) that grows the page
// doesn't leave us clamped short of where we meant to be.
const SETTLE_MS = 900

// Restores the scroll position saved by `rememberReturnScroll()` once the app
// navigates (back) to the matching URL — e.g. after a guest logs in and is
// returned to the product/shop page they were on.
function ScrollRestorer() {
  const pathname = usePathname()

  React.useEffect(() => {
    const here = window.location.pathname + window.location.search
    const target = takeReturnScroll(here)
    if (target == null) return

    let raf = 0
    let stopped = false
    const stop = () => {
      stopped = true
    }
    // Yield immediately if the user starts scrolling themselves.
    window.addEventListener("wheel", stop, { passive: true, once: true })
    window.addEventListener("touchmove", stop, { passive: true, once: true })
    window.addEventListener("keydown", stop, { once: true })

    const startedAt = performance.now()
    const settle = () => {
      if (stopped) return
      const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      )
      const y = Math.min(target, maxY)
      if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y)
      if (performance.now() - startedAt < SETTLE_MS) {
        raf = requestAnimationFrame(settle)
      }
    }
    raf = requestAnimationFrame(settle)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener("wheel", stop)
      window.removeEventListener("touchmove", stop)
      window.removeEventListener("keydown", stop)
    }
  }, [pathname])

  return null
}

export { ScrollRestorer }
