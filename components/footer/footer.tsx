import Link from "next/link"

import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/footer/social-icons"

const FOOTER_LINKS: {
  title: string
  links: { label: string; href: string }[]
}[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Best Deals", href: "/shop?discounted=1" },
      { label: "New Arrivals", href: "/shop" },
      { label: "Categories", href: "/shop" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/help#contact" },
      { label: "FAQs", href: "/help#faq" },
      { label: "Shipping & Returns", href: "/help#policies" },
      { label: "Payment Options", href: "/help#orders-payment" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/help" },
      { label: "Create an Account", href: "/signup" },
      { label: "Privacy Policy", href: "/help#policies" },
      { label: "Terms of Service", href: "/help#policies" },
    ],
  },
]

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: XIcon, label: "X", href: "https://x.com" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com" },
]

function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 md:py-10 lg:px-10 xl:px-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-background"
            >
              QuickBuy
            </Link>
            <p className="mt-3 max-w-xs text-sm text-background/60">
              Quality products, unbeatable prices, delivered fast.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-8 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-background">
                {group.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/60 transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-background/10 pt-6 text-center">
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} QuickBuy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
