import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { buildShopHref, type ShopParams } from "@/lib/shop-url"

const WINDOW = 2

function getPageNumbers(
  current: number,
  totalPages: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [1]

  const start = Math.max(2, current - WINDOW)
  const end = Math.min(totalPages - 1, current + WINDOW)

  if (start > 2) pages.push("ellipsis")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push("ellipsis")

  pages.push(totalPages)
  return pages
}

function ShopPagination({
  total,
  page,
  pageSize,
  searchParams,
}: {
  total: number
  page: number
  pageSize: number
  searchParams: ShopParams
}) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildShopHref(searchParams, {
              page: String(Math.max(1, page - 1)),
            })}
            className={
              page <= 1 ? "pointer-events-none opacity-40" : undefined
            }
          />
        </PaginationItem>

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildShopHref(searchParams, { page: String(p) })}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={buildShopHref(searchParams, {
              page: String(Math.min(totalPages, page + 1)),
            })}
            className={
              page >= totalPages ? "pointer-events-none opacity-40" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { ShopPagination }
