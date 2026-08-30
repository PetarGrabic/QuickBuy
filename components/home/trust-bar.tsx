import { sanityFetch } from "@/lib/sanity/fetch"
import { iconFor } from "@/lib/sanity/icon-map"
import { HOME_PAGE_QUERY } from "@/lib/sanity/queries"
import type { HOME_PAGE_QUERY_RESULT } from "@/sanity.types"

const FALLBACK_ITEMS = [
  { _key: "s1", icon: "truck", title: "Free Shipping", description: "On all orders over $50" },
  { _key: "s2", icon: "shield-check", title: "Secure Payment", description: "100% protected checkout" },
  { _key: "s3", icon: "rotate-ccw", title: "Easy Returns", description: "30-day return policy" },
  { _key: "s4", icon: "headphones", title: "24/7 Support", description: "Dedicated customer care" },
]

async function TrustBar() {
  const data = await sanityFetch<HOME_PAGE_QUERY_RESULT>({
    query: HOME_PAGE_QUERY,
    tags: ["homePage"],
  })
  const items = data?.trustItems?.length ? data.trustItems : FALLBACK_ITEMS

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 justify-items-center gap-x-4 gap-y-6 px-4 py-6 sm:px-6 md:py-8 md:grid-cols-4 md:gap-4 lg:px-10 xl:px-14">
        {items.map((item) => {
          const Icon = iconFor(item.icon)
          return (
            <div key={item._key} className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="size-5 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { TrustBar }
