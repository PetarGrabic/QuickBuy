"use client"

import * as React from "react"
import { Drawer } from "@base-ui/react/drawer"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NavLink } from "@/components/header/nav-link"
import { NAV_ITEMS } from "@/components/header/nav-items"
import { HeaderAuth } from "@/components/header/header-auth"

function MobileMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="right">
      <Drawer.Trigger
        render={
          <Button variant="outline" size="icon" aria-label="Open menu" />
        }
      >
        <Menu />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-y-0 right-0 z-50 flex w-full max-w-70 sm:max-w-xs">
          <Drawer.Popup className="flex h-full w-full flex-col bg-background shadow-2xl outline-none transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full">
            <div className="flex h-20 items-center justify-between border-b border-border px-4">
              <Drawer.Title className="text-lg font-semibold text-foreground">
                Menu
              </Drawer.Title>
              <Drawer.Close
                render={
                  <Button variant="outline" size="icon" aria-label="Close menu" />
                }
              >
                <X />
              </Drawer.Close>
            </div>

            <nav className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  variant="mobile"
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-border p-4">
              <HeaderAuth variant="mobile" onNavigate={() => setOpen(false)} />
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export { MobileMenu }
