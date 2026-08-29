import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Page not found · QuickBuy" }

function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-10 xl:px-14">
      <span className="text-7xl font-bold text-muted-foreground/25 sm:text-8xl">
        404
      </span>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          Back to Home
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/shop" />}
        >
          Browse Shop
        </Button>
      </div>
    </div>
  )
}

export default NotFound
