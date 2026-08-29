"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { ProductImage } from "@/components/product-image"

const ARROW_BUTTON_CLASS =
  "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-md outline-none backdrop-blur transition-opacity focus-visible:ring-2 focus-visible:ring-ring/50 lg:hidden"

const SETTLE_DELAY = 120

function ProductGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const count = images.length
  const hasMultiple = count > 1

  // The track renders [clone-of-last, ...images, clone-of-first] so a mobile
  // swipe or arrow press past either end can keep scrolling in the same
  // direction into a clone, then gets invisibly snapped to the real slide at
  // the other end — that's what makes the loop feel immediate instead of
  // requiring a scroll back across every image.
  const slides = hasMultiple ? [images[count - 1], ...images, images[0]] : images
  const trackPosOf = React.useCallback((realIndex: number) => realIndex + 1, [])

  const [activeIndex, setActiveIndex] = React.useState(0)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const settleTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  React.useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || !hasMultiple) return
    track.scrollLeft = trackPosOf(0) * track.clientWidth
  }, [hasMultiple, trackPosOf])

  const scrollToTrackPos = React.useCallback((pos: number, smooth = true) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({
      left: pos * track.clientWidth,
      behavior: smooth ? "smooth" : "auto",
    })
  }, [])

  React.useEffect(() => {
    const track = trackRef.current
    if (!track || !hasMultiple) return

    function settle() {
      const track = trackRef.current
      if (!track) return
      const width = track.clientWidth
      const pos = Math.round(track.scrollLeft / width)

      if (pos === 0) {
        track.scrollLeft = trackPosOf(count - 1) * width
        setActiveIndex(count - 1)
      } else if (pos === count + 1) {
        track.scrollLeft = trackPosOf(0) * width
        setActiveIndex(0)
      } else {
        setActiveIndex(pos - 1)
      }
    }

    function onScroll() {
      clearTimeout(settleTimer.current)
      settleTimer.current = setTimeout(settle, SETTLE_DELAY)
    }

    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      clearTimeout(settleTimer.current)
    }
  }, [hasMultiple, count, trackPosOf])

  function goToIndex(index: number) {
    setActiveIndex(index)
    scrollToTrackPos(trackPosOf(index))
  }

  function step(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const currentPos = Math.round(track.scrollLeft / track.clientWidth)
    scrollToTrackPos(currentPos + direction)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div
          ref={trackRef}
          className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden border-y border-border bg-muted [-ms-overflow-style:none] scrollbar-none lg:snap-none lg:overflow-x-hidden lg:rounded-xl lg:border [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((src, i) => {
            const isClone = hasMultiple && (i === 0 || i === slides.length - 1)
            const realIndex = hasMultiple ? (i === 0 ? count - 1 : i - 1) : i
            return (
              <div
                key={`slide-${i}`}
                className="relative w-full shrink-0 snap-center snap-always"
                aria-hidden={isClone}
              >
                <ProductImage
                  src={src}
                  alt={
                    isClone
                      ? ""
                      : realIndex === 0
                        ? title
                        : `${title} — image ${realIndex + 1}`
                  }
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading={i === 1 ? "eager" : "lazy"}
                  fetchPriority={i === 1 ? "high" : "auto"}
                  className="object-contain p-8"
                />
              </div>
            )
          })}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className={cn(ARROW_BUTTON_CLASS, "left-3")}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className={cn(ARROW_BUTTON_CLASS, "right-3")}
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="hidden gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] scrollbar-none lg:flex [&::-webkit-scrollbar]:hidden">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => goToIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 lg:size-24",
                index === activeIndex
                  ? "border-2 border-foreground"
                  : "border border-border hover:border-foreground/50"
              )}
            >
              <ProductImage
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { ProductGallery }
