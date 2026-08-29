import { getCategories } from "@/lib/products"
import { SearchAutocomplete } from "@/components/search/search-autocomplete"

async function HeroSearch() {
  const categories = await getCategories()

  return (
    <div className="relative z-10 mx-auto -mt-12 mb-10 hidden max-w-3xl px-4 sm:px-6 md:mb-16 md:block lg:px-10">
      <SearchAutocomplete variant="hero" categories={categories} />
    </div>
  )
}

export { HeroSearch }
