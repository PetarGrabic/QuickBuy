import { CartButton } from "@/components/header/cart-button"
import { HeaderAuth } from "@/components/header/header-auth"

function HeaderActions() {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <CartButton className="lg:size-11" />
      <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
      <HeaderAuth variant="desktop" />
    </div>
  )
}

export { HeaderActions }
