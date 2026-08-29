import { Skeleton } from "@/components/ui/skeleton"

function DetailRowSkeleton() {
  return (
    <>
      <Skeleton className="h-3 w-14" />
      <Skeleton className="h-3 w-32" />
    </>
  )
}

function ReviewRowSkeleton() {
  return (
    <div className="flex gap-4 border-b border-border pb-6 last:border-0 last:pb-0">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

function RelatedCardSkeleton() {
  return (
    <div className="flex w-48 shrink-0 flex-col gap-3 sm:w-64">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  )
}

function ProductPageLoading() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-10 lg:py-10 xl:px-14">
      <Skeleton className="h-5 w-64" />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-8 lg:mt-6 lg:grid-cols-2 lg:gap-12">
        <div className="-mx-4 flex flex-col gap-3 sm:-mx-6 lg:mx-0">
          <Skeleton className="aspect-square w-full lg:rounded-xl" />
          <div className="hidden gap-3 px-4 sm:px-6 lg:flex lg:px-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="size-20 rounded-lg lg:size-24" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-7 w-1/2 sm:h-8" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="h-10 w-28 rounded-md sm:h-11" />
              <Skeleton className="h-10 w-32 rounded-md sm:h-11" />
              <Skeleton className="size-10 shrink-0 rounded-md sm:size-11" />
            </div>
          </div>

          <div className="mt-2 border-t border-border pt-6 lg:mt-8">
            <Skeleton className="h-3 w-16" />
            <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <DetailRowSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 md:mt-16">
        <Skeleton className="h-6 w-48" />
        <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
          <div className="flex h-fit flex-col gap-4 rounded-xl border border-border bg-muted/40 p-6">
            <Skeleton className="h-10 w-16" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-1.5 w-full rounded-full" />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ReviewRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 md:mt-16">
        <Skeleton className="h-6 w-40" />
        <div className="mt-5 flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <RelatedCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductPageLoading
