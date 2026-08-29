import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react"

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over $50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% protected checkout",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer care",
  },
]

function TrustBar() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 justify-items-center gap-x-4 gap-y-6 px-4 py-6 sm:px-6 md:py-8 md:grid-cols-4 md:gap-4 lg:px-10 xl:px-14">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="size-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {title}
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { TrustBar }
