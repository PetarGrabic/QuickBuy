import Link from "next/link"
import {
  Armchair,
  ArrowRight,
  Droplet,
  Glasses,
  Laptop,
  Smartphone,
  ShoppingBag,
  Sparkles,
  Watch,
} from "lucide-react"

import { cn } from "@/lib/utils"

const CATEGORIES = [
  { slug: "smartphones", name: "Smartphones", icon: Smartphone },
  { slug: "laptops", name: "Laptops", icon: Laptop },
  { slug: "fragrances", name: "Fragrances", icon: Sparkles },
  { slug: "skin-care", name: "Skin Care", icon: Droplet },
  { slug: "furniture", name: "Furniture", icon: Armchair },
  { slug: "womens-bags", name: "Bags", icon: ShoppingBag },
  { slug: "sunglasses", name: "Sunglasses", icon: Glasses },
  { slug: "womens-watches", name: "Watches", icon: Watch },
]

function CategoryGrid() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 md:py-10 lg:px-10 xl:px-14">
        <div className="mb-5 flex items-start justify-between sm:mb-8 sm:items-end">
          <Link href="/shop" className="group">
            <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:underline sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find exactly what you&apos;re looking for
            </p>
          </Link>
          <Link
            href="/shop"
            className="mt-3 flex shrink-0 items-center gap-1 text-sm font-medium whitespace-nowrap text-foreground hover:underline sm:mt-0"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {CATEGORIES.map(({ slug, name, icon: Icon }, index) => (
            <Link
              key={slug}
              href={`/shop?category=${slug}`}
              className={cn(
                "group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-6 text-center transition-colors hover:border-foreground/40 hover:bg-muted/50",
                index >= 4 && "hidden sm:flex"
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-foreground group-hover:text-background">
                <Icon className="size-5" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export { CategoryGrid }
