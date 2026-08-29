import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "@/components/shop/product-grid-skeleton"

function SidebarSectionSkeleton({ rows }: { rows: number }) {
  return (
    <div>
      <Skeleton className="mb-3 h-4 w-24" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}

function ShopLoading() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-4 pb-10 sm:px-6 lg:px-10 lg:py-10 xl:px-14">
      <Skeleton className="mx-auto mb-8 hidden h-12 max-w-2xl rounded-full md:block" />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden shrink-0 flex-col gap-8 lg:flex lg:w-64">
          <SidebarSectionSkeleton rows={2} />
          <SidebarSectionSkeleton rows={5} />
          <SidebarSectionSkeleton rows={2} />
          <SidebarSectionSkeleton rows={4} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
            </div>
            <Skeleton className="mt-4 h-4 w-32" />
          </div>

          <div className="hidden items-center justify-between gap-4 lg:flex">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>

          <div className="mt-4 border-t border-border" />

          <div className="mt-6">
            <ProductGridSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopLoading
