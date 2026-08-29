"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

function NavLink({
  href,
  label,
  variant = "desktop",
  onNavigate,
}: {
  href: string
  label: string
  variant?: "desktop" | "mobile"
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center rounded-lg border border-l-4 px-3 py-3 text-base font-medium shadow-xs transition-colors",
          isActive
            ? "border-border border-l-foreground bg-muted text-foreground"
            : "border-border border-l-transparent text-muted-foreground hover:border-l-foreground/40 hover:bg-muted/60 hover:text-foreground"
        )}
      >
        {label}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-full items-center border-b-2 px-5 text-sm font-medium tracking-wide transition-colors lg:px-6 lg:text-base",
        isActive
          ? "border-foreground text-foreground hover:bg-muted/40"
          : "border-transparent text-muted-foreground hover:border-foreground/40 hover:bg-muted/40 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  )
}

export { NavLink }
