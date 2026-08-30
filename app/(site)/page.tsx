import { Hero } from "@/components/home/hero"
import { TrustBar } from "@/components/home/trust-bar"
import { CategoryGrid } from "@/components/home/category-grid"
import { BestDeals } from "@/components/home/best-deals"
import { PromoBanner } from "@/components/home/promo-banner"
import { TopRated } from "@/components/home/top-rated"
import { LowStock } from "@/components/home/low-stock"
import { Newsletter } from "@/components/home/newsletter"

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <BestDeals />
      <PromoBanner />
      <TopRated />
      <LowStock />
      <Newsletter />
    </>
  )
}
