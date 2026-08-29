"use client"

import * as React from "react"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { TriangleAlertIcon } from "lucide-react"

import "./globals.css"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/header/logo"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

// This replaces the entire document (including app/layout.tsx) when a root
// layout error occurs — e.g. Header's own getCategories() fetch throwing.
// It must be fully self-contained: own <html>/<body>, its own font loaders,
// and its own globals.css import. No Header/Footer/CartProvider here since
// Header is an async Server Component and can't be rendered from a Client
// Component boundary — Logo is safe to reuse since it's just a plain Link.
function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="flex min-h-full flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <Logo />
        <TriangleAlertIcon
          className="mt-4 size-10 text-muted-foreground"
          aria-hidden="true"
        />
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          A critical error occurred and the page couldn&apos;t load. Please
          try again.
        </p>
        <Button className="mt-2" onClick={() => retry()}>
          Try again
        </Button>
      </body>
    </html>
  )
}

export default GlobalError
