import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/header/cart-button"

function HeaderActions() {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <CartButton className="lg:size-11" />
      <div className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
      <Button
        variant="outline"
        className="lg:h-10 lg:px-5 lg:text-base"
        nativeButton={false}
        render={<Link href="/login" />}
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
    </div>
  )
}

export { HeaderActions }
