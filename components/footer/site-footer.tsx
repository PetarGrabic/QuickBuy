"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

// Routes that render the stripped-down, white footer instead of the full one.
const MINIMAL_FOOTER_ROUTES = new Set(["/login", "/signup"])

function SiteFooter({
  full,
  minimal,
}: {
  full: ReactNode
  minimal: ReactNode
}) {
  const pathname = usePathname()
  return MINIMAL_FOOTER_ROUTES.has(pathname) ? minimal : full
}

export { SiteFooter }
