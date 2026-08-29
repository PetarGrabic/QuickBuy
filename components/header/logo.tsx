import Link from "next/link"

function Logo() {
  return (
    <Link
      href="/"
      className="shrink-0 text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl"
    >
      QuickBuy
    </Link>
  )
}

export { Logo }
