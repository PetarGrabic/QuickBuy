import { Loader2 } from "lucide-react"

function Loading() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-[calc(100dvh-4.5rem)]">
      <Loader2 className="size-8 animate-spin text-muted-foreground" aria-label="Loading" />
    </div>
  )
}

export default Loading
