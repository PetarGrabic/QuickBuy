import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

function StarFill({
  percent,
  className,
  filledClassName,
  emptyClassName,
}: {
  percent: number
  className?: string
  filledClassName: string
  emptyClassName: string
}) {
  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      <Star className={cn("absolute inset-0 size-full", emptyClassName)} />
      {percent > 0 && (
        <Star
          className={cn("absolute inset-0 size-full", filledClassName)}
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        />
      )}
    </span>
  )
}

function StarRating({
  rating,
  className,
  starClassName = "size-3.5",
  filledClassName = "fill-foreground text-foreground",
  emptyClassName = "text-muted-foreground",
}: {
  rating: number
  className?: string
  starClassName?: string
  filledClassName?: string
  emptyClassName?: string
}) {
  const clamped = Math.min(5, Math.max(0, rating))

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const percent = Math.round(
          Math.min(1, Math.max(0, clamped - i)) * 100
        )
        return (
          <StarFill
            key={i}
            percent={percent}
            className={starClassName}
            filledClassName={filledClassName}
            emptyClassName={emptyClassName}
          />
        )
      })}
    </div>
  )
}

export { StarRating }
