"use client"

import * as React from "react"
import Link from "next/link"
import { TriangleAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-10 xl:px-14">
      <TriangleAlertIcon
        className="size-10 text-muted-foreground"
        aria-hidden="true"
      />
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while loading this page. You can try
        again, or head back home.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default Error
