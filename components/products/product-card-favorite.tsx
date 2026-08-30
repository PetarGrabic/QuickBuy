"use client"

import * as React from "react"
import { Heart } from "lucide-react"

import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { useFavorites } from "@/lib/favorites/favorites-context"
import { rememberReturnScroll } from "@/lib/scroll-restore"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { FavoriteAuthPrompt } from "@/components/products/favorite-auth-prompt"

// Favorite toggle for the top-right corner of a ProductCard image. Bare heart
// icon (no button chrome). Logged-in users toggle a DB-backed favorite; guests
// get a small "log in to save favorites" popover under the heart.
function ProductCardFavorite({
  product,
  large = false,
}: {
  product: Product
  large?: boolean
}) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [promptOpen, setPromptOpen] = React.useState(false)

  const favorited = user ? isFavorite(product.id) : false
  const label = favorited ? "Remove from favorites" : "Add to favorites"

  const triggerClass =
    "group/fav absolute top-0 right-0 z-20 rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
  const icon = (
    <Heart
      className={cn(
        "drop-shadow-[0_0_2px_rgb(255_255_255/0.85)] transition-[transform,color] duration-200 group-hover/fav:scale-110 group-active/fav:scale-95",
        large ? "size-6" : "size-5 sm:size-6",
        favorited
          ? "fill-foreground text-foreground"
          : "text-muted-foreground group-hover/fav:text-foreground"
      )}
    />
  )

  if (!user) {
    return (
      <Popover
        open={promptOpen}
        onOpenChange={(next) => {
          // Capture the scroll position now, before the popover mounts and can
          // nudge it, so we can return the user here after they log in.
          if (next) rememberReturnScroll()
          setPromptOpen(next)
        }}
      >
        <PopoverTrigger
          render={
            <button type="button" aria-label={label} className={triggerClass} />
          }
        >
          {icon}
        </PopoverTrigger>
        <FavoriteAuthPrompt productId={product.id} />
      </Popover>
    )
  }

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(product.id)}
      aria-pressed={favorited}
      aria-label={label}
      className={triggerClass}
    >
      {icon}
    </button>
  )
}

export { ProductCardFavorite }
