import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { formatCategoryName, truncateForDisplay } from "@/lib/utils"

function Breadcrumb({ category, title }: { category: string; title: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
    >
      <Link href="/" className="hover:text-foreground hover:underline">
        Home
      </Link>
      <ChevronRight className="size-3.5 shrink-0" />
      <Link href="/shop" className="hover:text-foreground hover:underline">
        Shop
      </Link>
      <ChevronRight className="size-3.5 shrink-0" />
      <Link
        href={`/shop?category=${category}`}
        className="hover:text-foreground hover:underline"
      >
        {formatCategoryName(category)}
      </Link>
      <ChevronRight className="hidden size-3.5 shrink-0 sm:block" />
      <span className="hidden truncate font-medium text-foreground sm:inline">
        {truncateForDisplay(title, 50)}
      </span>
    </nav>
  )
}

export { Breadcrumb }
