import Link from "next/link"

import { Button } from "@/components/ui/button"
import { HeroSearch } from "@/components/home/hero-search"
import { sanityFetch } from "@/lib/sanity/fetch"
import { HOME_PAGE_QUERY } from "@/lib/sanity/queries"
import type { HOME_PAGE_QUERY_RESULT } from "@/sanity.types"

const FALLBACK = {
  heading: "Discover the Best Deals on\nTop Quality Products",
  subheading:
    "Shop the latest trends in electronics, fashion, home goods, and more.\nFast shipping and satisfaction guaranteed.",
  primaryCta: { label: "Shop Now", href: "/shop" },
  secondaryCta: { label: "Explore Deals", href: "/shop?discounted=1" },
}

async function Hero() {
  const data = await sanityFetch<HOME_PAGE_QUERY_RESULT>({
    query: HOME_PAGE_QUERY,
    tags: ["homePage"],
  })
  const hero = data?.hero

  const heading = hero?.heading ?? FALLBACK.heading
  const subheading = hero?.subheading ?? FALLBACK.subheading
  const primaryCta = {
    label: hero?.primaryCta?.label ?? FALLBACK.primaryCta.label,
    href: hero?.primaryCta?.href ?? FALLBACK.primaryCta.href,
  }
  const secondaryCta = {
    label: hero?.secondaryCta?.label ?? FALLBACK.secondaryCta.label,
    href: hero?.secondaryCta?.href ?? FALLBACK.secondaryCta.href,
  }

  return (
    <div className="relative">
      <section className="bg-linear-to-b from-muted from-99% to-background">
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-8 text-center sm:px-6 md:pt-16 md:pb-28 lg:px-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-balance whitespace-pre-line text-foreground sm:text-5xl md:text-6xl">
            {heading}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-pretty whitespace-pre-line text-muted-foreground sm:text-lg">
            {subheading}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              className="lg:h-12 lg:px-8 lg:text-base"
              render={<Link href={primaryCta.href} />}
            >
              {primaryCta.label}
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="lg:h-12 lg:px-8 lg:text-base"
              render={<Link href={secondaryCta.href} />}
            >
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </section>

      <HeroSearch />
    </div>
  )
}

export { Hero }
