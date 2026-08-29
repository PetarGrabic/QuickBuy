import { Star } from "lucide-react"

import type { ProductReview } from "@/lib/dummyjson"
import { StarRating } from "@/components/star-rating"

const STAR_LEVELS = [5, 4, 3, 2, 1] as const

function formatReviewDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function ReviewSummary({ reviews }: { reviews: ProductReview[] }) {
  const total = reviews.length
  const average = total
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
    : 0

  const counts = STAR_LEVELS.reduce(
    (acc, star) => {
      acc[star] = reviews.filter((r) => Math.round(r.rating) === star).length
      return acc
    },
    {} as Record<number, number>
  )

  return (
    <div className="flex h-fit flex-col gap-8 rounded-xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
      <div className="flex shrink-0 flex-col items-center gap-1 sm:items-start">
        <span className="text-4xl font-bold text-foreground">
          {average.toFixed(1)}
        </span>
        <StarRating rating={average} starClassName="size-4" />
        <span className="text-sm text-muted-foreground">
          {total} {total === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        {STAR_LEVELS.map((star) => {
          const count = counts[star]
          const percent = total ? (count / total) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-muted-foreground">{star}</span>
              <Star className="size-3.5 shrink-0 fill-foreground text-foreground" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-5 shrink-0 text-right text-muted-foreground">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground">
        Customer Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
          <ReviewSummary reviews={reviews} />

          <div className="flex flex-col gap-6">
            {reviews.map((review, index) => (
              <div
                key={`${review.reviewerEmail}-${index}`}
                className="flex gap-4 border-b border-border pb-6 last:border-0 last:pb-0"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {review.reviewerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {review.reviewerName}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatReviewDate(review.date)}
                    </span>
                  </div>
                  <StarRating
                    rating={review.rating}
                    starClassName="size-3.5"
                    className="mt-1"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export { ProductReviews }
