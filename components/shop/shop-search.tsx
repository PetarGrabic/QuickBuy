import { SearchAutocomplete } from "@/components/search/search-autocomplete"
import type { Category } from "@/lib/products"

function ShopSearch({
  categories,
  defaultQuery,
}: {
  categories: Category[]
  defaultQuery?: string
}) {
  return (
    <div className="mx-auto mb-8 hidden max-w-2xl md:block">
      <SearchAutocomplete
        variant="hero"
        categories={categories}
        defaultQuery={defaultQuery}
        compact
      />
    </div>
  )
}

export { ShopSearch }
