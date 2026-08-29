import Link from "next/link"

import { Button } from "@/components/ui/button"

function PromoBanner() {
  return (
    <section className="bg-foreground">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 px-4 py-8 text-center sm:px-6 md:py-14 lg:flex-row lg:justify-center lg:gap-14 lg:px-10 lg:text-left xl:px-14">
        <div>
          <p className="text-sm font-semibold tracking-widest text-background/60 uppercase">
            Limited Time
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-background sm:text-4xl">
            Up to 20% Off Selected Items
          </h2>
          <p className="mt-2 max-w-md text-pretty text-background/70">
            Refresh your electronics, wardrobe, and home essentials before the
            offer ends.
          </p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/shop?discounted=1" />}
          className="shrink-0 bg-background text-foreground hover:bg-background/90 lg:h-12 lg:px-8 lg:text-base"
        >
          Shop the Sale
        </Button>
      </div>
    </section>
  )
}

export { PromoBanner }
