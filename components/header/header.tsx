import { Logo } from "@/components/header/logo"
import { NavLink } from "@/components/header/nav-link"
import { NAV_ITEMS } from "@/components/header/nav-items"
import { HeaderActions } from "@/components/header/header-actions"
import { CartButton } from "@/components/header/cart-button"
import { MobileMenu } from "@/components/header/mobile-menu"
import { MobileSearch } from "@/components/header/mobile-search"
import { getCategories } from "@/lib/dummyjson"

async function Header() {
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background relative">
      <div className="mx-auto flex h-16 md:h-18 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-14">
        <Logo />

        <nav className="hidden h-full items-stretch gap-2 lg:gap-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <HeaderActions />

        <MobileSearch categories={categories}>
          <CartButton />
          <MobileMenu />
        </MobileSearch>
      </div>
    </header>
  )
}

export { Header }
