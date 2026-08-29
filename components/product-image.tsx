"use client"

import * as React from "react"
import Image, { type ImageProps } from "next/image"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Drop-in replacement for a `fill`-based next/image usage: shows a pulsing
// skeleton until the image has loaded, and an icon fallback if it fails to
// load. Assumes the parent provides a `relative overflow-hidden` sized box
// (every call site already does, for the `fill` layout to work).
function ProductImage({ className, src, alt, ...props }: ImageProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    "loading"
  )
  // Tracks the `src` the current `status` applies to, so swapping `src` on
  // an already-mounted instance resets to "loading" — computed during
  // render (React's documented pattern for resetting state when a prop
  // changes) rather than in an effect, which would flash the old image for
  // one extra frame before the reset takes effect.
  const [statusSrc, setStatusSrc] = React.useState(src)
  if (src !== statusSrc) {
    setStatusSrc(src)
    setStatus("loading")
  }

  if (status === "error") {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <ImageOff className="size-6" aria-hidden="true" />
      </div>
    )
  }

  return (
    <>
      {status === "loading" && <Skeleton className="absolute inset-0" />}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          status === "loading" ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        {...props}
      />
    </>
  )
}

export { ProductImage }
