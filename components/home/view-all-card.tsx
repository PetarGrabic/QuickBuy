import Link from "next/link"
import { ArrowRight } from "lucide-react"

function ViewAllCard({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group flex aspect-square w-48 shrink-0 self-start flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center transition-colors hover:border-foreground sm:w-64"
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-foreground group-hover:text-background">
        <ArrowRight className="size-4" />
      </div>
      <span className="text-sm font-medium text-foreground">View All</span>
    </Link>
  )
}

export { ViewAllCard }
