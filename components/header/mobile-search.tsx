"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchAutocomplete } from "@/components/search/search-autocomplete"
import type { Category } from "@/lib/products"

function MobileSearch({
  children,
  categories,
}: {
  children: React.ReactNode
  categories: Category[]
}) {
  const [open, setOpen] = React.useState(false)

  // The default row and the search overlay both stay mounted at all times —
  // only visibility toggles. `children` (CartButton, MobileMenu) must never
  // unmount here: unmounting and remounting CartButton re-runs its
  // mount effect, which reopens the "added to cart" popover for whatever
  // item was last added, even though nothing was just added to cart.
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 md:hidden",
          open && "invisible"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="Search"
          onClick={() => setOpen(true)}
        >
          <Search />
        </Button>
        {children}
      </div>
      {open && (
        <div className="absolute inset-0 z-50 flex items-center gap-2 bg-background px-4 sm:px-6 md:hidden">
          <SearchAutocomplete
            variant="mobile"
            categories={categories}
            onNavigate={() => setOpen(false)}
            trailing={
              <Button
                variant="outline"
                size="icon"
                aria-label="Close search"
                className="rounded-full"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            }
          />
        </div>
      )}
    </>
  )
}

export { MobileSearch }
