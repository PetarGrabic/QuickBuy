"use client"

import * as React from "react"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { useFavorites } from "@/lib/favorites/favorites-context"
import { rememberReturnScroll } from "@/lib/scroll-restore"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { FavoriteAuthPrompt } from "@/components/products/favorite-auth-prompt"

// Favorite toggle on the product detail page. Logged-in users toggle a
// DB-backed favorite; guests get a "log in to save favorites" popover.
function FavoriteButton({ productId }: { productId: number }) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [promptOpen, setPromptOpen] = React.useState(false)

  const favorited = user ? isFavorite(productId) : false
  const label = favorited ? "Remove from favorites" : "Add to favorites"
  const icon = (
    <Heart className={cn(favorited && "fill-foreground text-foreground")} />
  )

  if (!user) {
    return (
      <Popover
        open={promptOpen}
        onOpenChange={(next) => {
          if (next) rememberReturnScroll()
          setPromptOpen(next)
        }}
      >
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label={label}
            />
          }
        >
          {icon}
        </PopoverTrigger>
        <FavoriteAuthPrompt productId={productId} />
      </Popover>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      onClick={() => toggleFavorite(productId)}
      aria-pressed={favorited}
      aria-label={label}
    >
      {icon}
    </Button>
  )
}

export { FavoriteButton }
