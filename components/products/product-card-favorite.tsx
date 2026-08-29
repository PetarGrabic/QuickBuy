"use client"

import * as React from "react"
import { Heart } from "lucide-react"

import type { Product } from "@/lib/dummyjson"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/toast"

// Favorite toggle for the top-right corner of a ProductCard image. Bare heart
// icon (no button chrome), visible on every screen size. Favorites aren't
// persisted yet — this is UI/UX only.
function ProductCardFavorite({
  product,
  large = false,
}: {
  product: Product
  large?: boolean
}) {
  const [isFavorited, setIsFavorited] = React.useState(false)

  function handleToggle() {
    const next = !isFavorited
    setIsFavorited(next)
    toast.add({
      title: next
        ? `Added ${product.title} to favorites`
        : `Removed ${product.title} from favorites`,
      type: "success",
      timeout: 2500,
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className="group/fav absolute top-0 right-0 z-20 rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <Heart
        className={cn(
          "drop-shadow-[0_0_2px_rgb(255_255_255/0.85)] transition-[transform,color] duration-200 group-hover/fav:scale-110 group-active/fav:scale-95",
          large ? "size-6" : "size-5 sm:size-6",
          isFavorited
            ? "fill-foreground text-foreground"
            : "text-muted-foreground group-hover/fav:text-foreground"
        )}
      />
    </button>
  )
}

export { ProductCardFavorite }
