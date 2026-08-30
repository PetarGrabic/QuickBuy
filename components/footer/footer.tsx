import Link from "next/link"

import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/footer/social-icons"
import { sanityFetch } from "@/lib/sanity/fetch"
import { FOOTER_QUERY } from "@/lib/sanity/queries"
import type { FOOTER_QUERY_RESULT } from "@/sanity.types"

const SOCIAL_META: Record<
  string,
  { label: string; Icon: (props: { className?: string }) => React.ReactElement }
> = {
  facebook: { label: "Facebook", Icon: FacebookIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
  x: { label: "X", Icon: XIcon },
  youtube: { label: "YouTube", Icon: YoutubeIcon },
}

const FALLBACK = {
  tagline: "Quality products, unbeatable prices, delivered fast.",
  linkColumns: [
    {
      _key: "shop",
      title: "Shop",
      links: [
        { _key: "s1", label: "All Products", href: "/shop" },
        { _key: "s2", label: "Best Deals", href: "/shop?discounted=1" },
        { _key: "s3", label: "New Arrivals", href: "/shop" },
        { _key: "s4", label: "Categories", href: "/shop" },
      ],
    },
    {
      _key: "support",
      title: "Support",
      links: [
        { _key: "p1", label: "Contact Us", href: "/help#contact" },
        { _key: "p2", label: "FAQs", href: "/help#faq" },
        { _key: "p3", label: "Shipping & Returns", href: "/help#policies" },
        { _key: "p4", label: "Payment Options", href: "/help#orders-payment" },
      ],
    },
    {
      _key: "company",
      title: "Company",
      links: [
        { _key: "c1", label: "About Us", href: "/help" },
        { _key: "c2", label: "Create an Account", href: "/signup" },
        { _key: "c3", label: "Privacy Policy", href: "/help#policies" },
        { _key: "c4", label: "Terms of Service", href: "/help#policies" },
      ],
    },
  ],
  socials: [
    { _key: "f", platform: "facebook", url: "https://facebook.com" },
    { _key: "i", platform: "instagram", url: "https://instagram.com" },
    { _key: "x", platform: "x", url: "https://x.com" },
    { _key: "y", platform: "youtube", url: "https://youtube.com" },
  ],
} satisfies NonNullable<FOOTER_QUERY_RESULT>

async function Footer() {
  const data = await sanityFetch<FOOTER_QUERY_RESULT>({
    query: FOOTER_QUERY,
    tags: ["footer"],
  })

  const tagline = data?.tagline ?? FALLBACK.tagline
  const linkColumns = data?.linkColumns?.length ? data.linkColumns : FALLBACK.linkColumns
  const socials = data?.socials?.length ? data.socials : FALLBACK.socials

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
            <p className="mt-3 max-w-xs text-sm text-background/60">{tagline}</p>
            <div className="mt-4 flex items-center gap-3">
              {socials.map((social) => {
                const meta = social.platform ? SOCIAL_META[social.platform] : undefined
                if (!meta || !social.url) return null
                const { label, Icon } = meta
                return (
                  <a
                    key={social._key}
                    href={social.url}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-8 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20"
                  >
                    <Icon className="size-3.5" />
                  </a>
                )
              })}
            </div>
          </div>

          {linkColumns.map((group) => (
            <div key={group._key}>
              <p className="text-sm font-semibold text-background">{group.title}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {(group.links ?? []).map((link) => (
                  <li key={link._key}>
                    <Link
                      href={link.href ?? "#"}
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
