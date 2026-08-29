import Link from "next/link"

import { Button } from "@/components/ui/button"
import { HeroSearch } from "@/components/home/hero-search"

function Hero() {
  return (
    <div className="relative">
      <section className="bg-linear-to-b from-muted from-99% to-background">
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-8 text-center sm:px-6 md:pt-16 md:pb-28 lg:px-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl">
            Discover the Best Deals on
            <br />
            Top Quality Products
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-pretty text-muted-foreground sm:text-lg">
            Shop the latest trends in electronics, fashion, home goods, and
            more.
            <br />
            Fast shipping and satisfaction guaranteed.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              className="lg:h-12 lg:px-8 lg:text-base"
              render={<Link href="/shop" />}
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="lg:h-12 lg:px-8 lg:text-base"
              render={<Link href="/shop?discounted=1" />}
            >
              Explore Deals
            </Button>
          </div>
        </div>
      </section>

      <HeroSearch />
    </div>
  )
}

export { Hero }
