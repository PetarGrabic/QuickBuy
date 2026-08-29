"use client"

import * as React from "react"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

function FavoriteButton() {
  const [isFavorited, setIsFavorited] = React.useState(false)

  function handleToggle() {
    const next = !isFavorited
    setIsFavorited(next)
    toast.add({
      title: next ? "Added to favorites" : "Removed from favorites",
      type: "success",
      timeout: 2500,
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      onClick={handleToggle}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(isFavorited && "fill-foreground text-foreground")}
      />
    </Button>
  )
}

export { FavoriteButton }
