"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const CARDS_PER_STEP = 3
const PIXELS_PER_MS = 1.1
const MIN_DURATION = 350
const MAX_DURATION = 900
const EDGE_THRESHOLD = 4

// A plain button, not the shared <Button>, since that component's active
// press effect (active:not-aria-[haspopup]:translate-y-px) can't be cleanly
// overridden per-instance: both rules end up setting the same underlying
// --tw-translate-y custom property that the composed `translate` shorthand
// reads from, and neither !important nor selector specificity resolves that
// the way a naive override would suggest. Simplest fix is to not have a
// competing rule to fight in the first place.
const SCROLL_BUTTON_CLASS =
  "absolute top-1/3 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md outline-none transition-all select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:flex [&_svg]:pointer-events-none [&_svg]:shrink-0"

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function animateScrollTo(
  el: HTMLElement,
  targetLeft: number,
  token: React.RefObject<number>
) {
  const runToken = ++token.current
  const startLeft = el.scrollLeft
  const distance = targetLeft - startLeft
  const duration = Math.min(
    MAX_DURATION,
    Math.max(MIN_DURATION, Math.abs(distance) / PIXELS_PER_MS)
  )
  const startTime = performance.now()

  function step(now: number) {
    if (token.current !== runToken) return
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    el.scrollLeft = startLeft + distance * easeInOutQuad(t)
    if (t < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

function Carousel({
  children,
  className,
  onOverflowChange,
}: {
  children: React.ReactNode
  className?: string
  onOverflowChange?: (hasOverflow: boolean) => void
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const animationToken = React.useRef(0)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateScrollState = React.useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const left = scroller.scrollLeft > EDGE_THRESHOLD
    const right =
      scroller.scrollLeft + scroller.clientWidth <
      scroller.scrollWidth - EDGE_THRESHOLD
    setCanScrollLeft(left)
    setCanScrollRight(right)
    onOverflowChange?.(
      left || right || scroller.scrollWidth > scroller.clientWidth + EDGE_THRESHOLD
    )
  }, [onOverflowChange])

  React.useLayoutEffect(() => {
    updateScrollState()
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.addEventListener("scroll", updateScrollState, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(scroller)

    return () => {
      scroller.removeEventListener("scroll", updateScrollState)
      resizeObserver.disconnect()
    }
  }, [updateScrollState])

  const scrollToCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const items = Array.from(scroller.children) as HTMLElement[]
    const current = scroller.scrollLeft
    const maxScrollLeft = Math.max(
      scroller.scrollWidth - scroller.clientWidth,
      0
    )
    // A fixed pixel step measured from real card geometry, applied directly
    // to wherever scrollLeft actually is right now. No searching through the
    // item list for "the next card index" — that indexing broke down
    // whenever the current position wasn't exactly aligned to a card (e.g.
    // after a previous animation was interrupted mid-flight), which could
    // silently compute a target equal to the current position and look like
    // the button "did nothing".
    const step =
      items.length >= 2
        ? items[1].offsetLeft - items[0].offsetLeft
        : scroller.clientWidth

    let targetLeft = current + direction * step * CARDS_PER_STEP
    targetLeft = Math.min(Math.max(targetLeft, 0), maxScrollLeft)

    // Snap to the true edge instead of stopping a step short of it.
    if (direction === 1 && maxScrollLeft - targetLeft < step) {
      targetLeft = maxScrollLeft
    } else if (direction === -1 && targetLeft < step) {
      targetLeft = 0
    }

    // Single source of truth for "is there anywhere to go": if the computed
    // target isn't meaningfully different from where we already are, skip
    // the animation entirely instead of trusting a separately tracked
    // disabled flag that can lag a frame behind real scroll state.
    if (Math.abs(targetLeft - current) < EDGE_THRESHOLD) return

    setCanScrollLeft(targetLeft > EDGE_THRESHOLD)
    setCanScrollRight(targetLeft < maxScrollLeft - EDGE_THRESHOLD)

    animateScrollTo(scroller, targetLeft, animationToken)
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {(canScrollLeft || canScrollRight) && (
        <>
          <button
            type="button"
            onClick={() => scrollToCard(-1)}
            aria-disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={cn(
              SCROLL_BUTTON_CLASS,
              "-left-4",
              canScrollLeft
                ? "hover:bg-muted hover:text-foreground active:translate-y-[calc(-50%+1px)]"
                : "opacity-40"
            )}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToCard(1)}
            aria-disabled={!canScrollRight}
            aria-label="Scroll right"
            className={cn(
              SCROLL_BUTTON_CLASS,
              "-right-4",
              canScrollRight
                ? "hover:bg-muted hover:text-foreground active:translate-y-[calc(-50%+1px)]"
                : "opacity-40"
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}
    </div>
  )
}

export { Carousel }
