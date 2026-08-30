import type { Metadata } from "next"

import { FavoritesView } from "@/components/favorites/favorites-view"

export const metadata: Metadata = {
  title: "Favorites · QuickBuy",
}

export default function FavoritesPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[1600px] flex-col px-4 pt-4 pb-10 sm:px-6 md:min-h-[calc(100dvh-4.5rem)] lg:px-10 lg:py-10 xl:px-14">
      <FavoritesView />
    </div>
  )
}
