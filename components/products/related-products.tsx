import { getProducts } from "@/lib/dummyjson"
import { RelatedProductsCarousel } from "@/components/products/related-products-carousel"

const MAX_DESKTOP = 10

async function RelatedProducts({
  category,
  excludeId,
}: {
  category: string
  excludeId: number
}) {
  const products = await getProducts({ category, limit: MAX_DESKTOP + 1 })
  const filtered = products
    .filter((p) => p.id !== excludeId)
    .slice(0, MAX_DESKTOP)

  if (filtered.length === 0) return null

  return <RelatedProductsCarousel products={filtered} category={category} />
}

export { RelatedProducts }
