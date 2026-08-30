"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Heart, LogOut, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
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
    const here = window.location.pathname + window.location.search
    router.push(
      isAuthPath(window.location.pathname)
        ? "/login"
        : `/login?next=${encodeURIComponent(here)}`
    )
    onNavigate?.()
  }

  async function handleLogout() {
    setMenuOpen(false)
    onNavigate?.()
    await signOut()
    router.refresh()
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
  const favorites = (
    <button
      type="button"
      onClick={() => {
        // Favorites page isn't built yet — this is intentionally inert.
        setMenuOpen(false)
        onNavigate?.()
      }}
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-muted"
    >
      <Heart className="size-4 text-muted-foreground" />
      Favorites
    </button>
  )

  const logout = (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-muted"
    >
      <LogOut className="size-4 text-muted-foreground" />
      Log out
    </button>
  )

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1 rounded-lg border border-border p-2">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-semibold text-foreground">
            {user.fullName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="mx-2 border-t border-border" />
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
            className={cn("rounded-full lg:size-10")}
          />
        }
      >
        <User />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="end">
          <PopoverPopup className="w-56 p-2">
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <div className="mx-2 my-1 border-t border-border" />
            {favorites}
            {logout}
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  )
}

export { HeaderAuth }
