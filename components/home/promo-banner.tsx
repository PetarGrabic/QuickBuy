import Link from "next/link"

import { Button } from "@/components/ui/button"
import { sanityFetch } from "@/lib/sanity/fetch"
import { HOME_PAGE_QUERY } from "@/lib/sanity/queries"
import type { HOME_PAGE_QUERY_RESULT } from "@/sanity.types"

const FALLBACK = {
  eyebrow: "Limited Time",
  heading: "Up to 20% Off Selected Items",
  body: "Refresh your electronics, wardrobe, and home essentials before the offer ends.",
  cta: { label: "Shop the Sale", href: "/shop?discounted=1" },
}

async function PromoBanner() {
  const data = await sanityFetch<HOME_PAGE_QUERY_RESULT>({
    query: HOME_PAGE_QUERY,
    tags: ["homePage"],
  })
  const promo = data?.promo

  const eyebrow = promo?.eyebrow ?? FALLBACK.eyebrow
  const heading = promo?.heading ?? FALLBACK.heading
  const body = promo?.body ?? FALLBACK.body
  const cta = {
    label: promo?.cta?.label ?? FALLBACK.cta.label,
    href: promo?.cta?.href ?? FALLBACK.cta.href,
  }

  return (
    <section className="bg-foreground">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 px-4 py-8 text-center sm:px-6 md:py-14 lg:flex-row lg:justify-center lg:gap-14 lg:px-10 lg:text-left xl:px-14">
        <div>
          <p className="text-sm font-semibold tracking-widest text-background/60 uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-background sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-md text-pretty text-background/70">{body}</p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href={cta.href} />}
          className="shrink-0 bg-background text-foreground hover:bg-background/90 lg:h-12 lg:px-8 lg:text-base"
        >
          {cta.label}
        </Button>
      </div>
    </section>
  )
}

export { PromoBanner }
