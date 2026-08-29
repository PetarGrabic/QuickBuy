import Link from "next/link"

import { Button } from "@/components/ui/button"

function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-10 xl:px-14">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Product not found
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        We couldn&apos;t find the product you were looking for. It may have
        been removed or the link may be incorrect.
      </p>
      <Button nativeButton={false} render={<Link href="/shop" />} className="mt-2">
        Back to Shop
      </Button>
    </div>
  )
}

export default ProductNotFound
