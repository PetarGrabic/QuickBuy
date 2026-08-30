"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, Heart, LogOut, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { rememberReturnScroll } from "@/lib/scroll-restore"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from "@/components/ui/popover"

interface HeaderAuthProps {
  variant: "desktop" | "mobile"
  onNavigate?: () => void
}

function HeaderAuth({ variant, onNavigate }: HeaderAuthProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  // `usePathname()` drops the query string; keep it for the no-JS href fallback
  // and read the exact current URL on click (avoids pulling `useSearchParams`
  // into the always-rendered header, which would deopt cached pages).
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = React.useState(false)

  // Never send the user back to an auth page after logging in.
  const isAuthPath = (path: string) =>
    path === "/login" || path === "/signup"

  const loginHref =
    pathname && !isAuthPath(pathname)
      ? `/login?next=${encodeURIComponent(pathname)}`
      : "/login"

  function goToLogin(event: React.MouseEvent) {
    event.preventDefault()
    const onAuthPage = isAuthPath(window.location.pathname)
    if (!onAuthPage) rememberReturnScroll()
    const here = window.location.pathname + window.location.search
    router.push(onAuthPage ? "/login" : `/login?next=${encodeURIComponent(here)}`)
    onNavigate?.()
  }

  async function handleLogout() {
    setMenuOpen(false)
    onNavigate?.()
    await signOut()
    router.push("/")
    router.refresh()
    // `router.push("/")` doesn't reset the scroll when we're already on "/",
    // so land at the top of the homepage explicitly.
    window.scrollTo({ top: 0, left: 0 })
  }

  // While auth is still resolving, `user` is null — we show the logged-out
  // controls (the common case). A returning logged-in user sees them swap to
  // the account menu once the session loads.
  if (!user) {
    if (variant === "mobile") {
      return (
        <>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={loginHref} />}
            onClick={goToLogin}
          >
            Log in
          </Button>
          <Button
            variant="default"
            nativeButton={false}
            render={<Link href="/signup" />}
            onClick={onNavigate}
          >
            Sign up
          </Button>
        </>
      )
    }
    return (
      <>
        <Button
          variant="outline"
          className="lg:h-10 lg:px-5 lg:text-base"
          nativeButton={false}
          render={<Link href={loginHref} />}
          onClick={goToLogin}
        >
          Log in
        </Button>
        <Button
          variant="default"
          className="lg:h-10 lg:px-5 lg:text-base"
          nativeButton={false}
          render={<Link href="/signup" />}
        >
          Sign up
        </Button>
      </>
    )
  }

  // --- Logged in ---------------------------------------------------------
  const itemClass =
    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50"

  const favorites = (
    <Link
      href="/favorites"
      onClick={() => {
        setMenuOpen(false)
        onNavigate?.()
      }}
      className={cn(
        itemClass,
        "text-foreground hover:bg-foreground/6   active:bg-foreground/10"
      )}
    >
      <Heart className="size-4.5 shrink-0 text-muted-foreground" />
      <span className="flex-1">Favorites</span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )

  const logout = (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        itemClass,
        "text-destructive hover:bg-destructive/10 active:bg-destructive/15"
      )}
    >
      <LogOut className="size-4.5 shrink-0" />
      <span className="flex-1">Log out</span>
    </button>
  )

  const accountHeader = (
    <div className="flex flex-col gap-0.5 px-3 py-2">
      <p className="truncate text-sm font-semibold text-foreground">
        {user.fullName}
      </p>
      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
    </div>
  )

  const divider = <div className="mx-1 my-1 h-px bg-border" />

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-border p-2.5">
        {accountHeader}
        {divider}
        {favorites}
        {logout}
      </div>
    )
  }

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Account menu"
            className={cn("rounded-full lg:size-12")}
          />
        }
      >
        <User className="size-5" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner
          side="bottom"
          align="center"
          sideOffset={10}
          collisionPadding={12}
        >
          <PopoverPopup className="w-64 p-2">
            {accountHeader}
            {divider}
            {favorites}
            {logout}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  )
}

export { HeaderAuth }
