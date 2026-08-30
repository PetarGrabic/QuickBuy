"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { rememberPendingFavorite } from "@/lib/favorites/pending-favorite"
import { Button } from "@/components/ui/button"
import {
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from "@/components/ui/popover"

// Content for the heart-icon popover shown to guests. Must be rendered inside a
// <Popover> (it provides the portal + positioner + popup).
function FavoriteAuthPrompt({ productId }: { productId: number }) {
  const router = useRouter()

  function goToLogin() {
    // The scroll position was already captured when this popover opened; just
    // remember which product to favorite once the user is back and signed in.
    rememberPendingFavorite(productId)
    const here = window.location.pathname + window.location.search
    router.push(`/login?next=${encodeURIComponent(here)}`)
  }

  return (
    <PopoverPortal>
      <PopoverPositioner side="bottom" align="center" sideOffset={8}>
        <PopoverPopup className="w-56 p-3">
          <p className="text-sm font-medium text-foreground">
            Save your favorites
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Log in or sign up to keep a list of products you love.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button size="sm" className="w-full" onClick={goToLogin}>
              Log in
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Sign up
            </Button>
          </div>
        </PopoverPopup>
      </PopoverPositioner>
    </PopoverPortal>
  )
}

export { FavoriteAuthPrompt }
