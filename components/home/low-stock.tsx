import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getLowStock } from "@/lib/dummyjson"
import { ProductCard } from "@/components/home/product-card"
import { Carousel } from "@/components/home/carousel"
import { ViewAllCard } from "@/components/home/view-all-card"

async function LowStock() {
  const products = await getLowStock(16)

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1600px] px-4 pb-6 pt-4 sm:px-6 md:pb-10 md:pt-7 lg:px-10 xl:px-14">
        <div className="mb-5 flex items-start justify-between sm:mb-8 sm:items-end">
          <Link href="/shop?lowStock=1" className="group">
            <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:underline sm:text-3xl">
              Last Chance
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Only a few left in stock — once they&apos;re gone, they&apos;re
              gone
            </p>
          </Link>
          <Link
            href="/shop?lowStock=1"
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
          <ViewAllCard href="/shop?lowStock=1" />
        </Carousel>
      </div>
    </section>
  )
}

export { LowStock }
