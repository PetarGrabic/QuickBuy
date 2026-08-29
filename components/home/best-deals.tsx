import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getBestDeals } from "@/lib/products"
import { ProductCard } from "@/components/home/product-card"
import { Carousel } from "@/components/home/carousel"
import { ViewAllCard } from "@/components/home/view-all-card"

async function BestDeals() {
  const products = await getBestDeals(16)

  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 md:py-10 lg:px-10 xl:px-14">
        <div className="mb-5 flex items-start justify-between sm:mb-8 sm:items-end">
          <Link href="/shop?discounted=1" className="group">
            <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:underline sm:text-3xl">
              Best Deals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Limited-time discounts you don&apos;t want to miss
            </p>
          </Link>
          <Link
            href="/shop?discounted=1"
            className="mt-3 flex shrink-0 items-center gap-1 text-sm font-medium whitespace-nowrap text-foreground hover:underline sm:mt-0"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <Carousel>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <ViewAllCard href="/shop?discounted=1" />
        </Carousel>
      </div>
    </section>
  )
}

export { BestDeals }
