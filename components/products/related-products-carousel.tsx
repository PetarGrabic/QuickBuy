"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"
import { ProductCard } from "@/components/home/product-card"
import { Carousel } from "@/components/home/carousel"
import { ViewAllCard } from "@/components/home/view-all-card"

const MAX_TABLET = 8
const MAX_MOBILE = 6

function RelatedProductsCarousel({
  products,
  category,
}: {
  products: Product[]
  category: string
}) {
  const [scrollable, setScrollable] = React.useState(false)
  const href = `/shop?category=${category}`

  return (
    <section>
      <div className="mb-5 flex items-start justify-between sm:mb-8 sm:items-end">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Related Products
        </h2>
        {scrollable && (
          <Link
            href={href}
            className="mt-3 flex shrink-0 items-center gap-1 text-sm font-medium whitespace-nowrap text-foreground hover:underline sm:mt-0"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>

      <Carousel onOverflowChange={setScrollable}>
        {products.map((product, index) => (
          <div
            key={product.id}
            className={cn(
              index >= MAX_TABLET
                ? "hidden lg:block"
                : index >= MAX_MOBILE
                  ? "hidden sm:block"
                  : "block"
            )}
          >
            <ProductCard product={product} />
          </div>
        ))}
        <ViewAllCard href={href} />
      </Carousel>
    </section>
  )
}

export { RelatedProductsCarousel }
