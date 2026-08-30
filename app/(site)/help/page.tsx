import type { Metadata } from "next"
import { ArrowDown } from "lucide-react"

import { FaqSection } from "@/components/help/faq-section"
import { PoliciesSection } from "@/components/help/policies-section"
import { SupportSection } from "@/components/help/support-section"
import { HELP_FALLBACK } from "@/components/help/fallback"
import { sanityFetch } from "@/lib/sanity/fetch"
import { HELP_CENTER_QUERY } from "@/lib/sanity/queries"
import type { HELP_CENTER_QUERY_RESULT } from "@/sanity.types"

export const metadata: Metadata = {
  title: "Help · QuickBuy",
  description:
    "Answers to common questions about orders, shipping, and returns, plus how to reach QuickBuy support.",
}

export default async function HelpPage() {
  const data = await sanityFetch<HELP_CENTER_QUERY_RESULT>({
    query: HELP_CENTER_QUERY,
    tags: ["helpCenter"],
  })

  const intro = data?.intro ?? HELP_FALLBACK.intro
  const faqGroups = data?.faqGroups?.length ? data.faqGroups : HELP_FALLBACK.faqGroups
  const policies = data?.policies?.length ? data.policies : HELP_FALLBACK.policies
  const supportChannels = data?.supportChannels?.length
    ? data.supportChannels
    : HELP_FALLBACK.supportChannels

  const jumpLinks = [
    ...faqGroups.map((group) => ({
      label: group.title ?? "",
      href: `#${group.groupId ?? ""}`,
    })),
    { label: "Policies", href: "#policies" },
    { label: "Contact support", href: "#contact" },
  ]

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {intro.heading}
          </h1>
          {intro.body ? (
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              {intro.body}
            </p>
          ) : null}
          <nav
            aria-label="Jump to section"
            className="mt-5 grid grid-cols-1 items-center gap-x-5 gap-y-2 min-[360px]:grid-cols-[repeat(2,auto)] sm:grid-cols-[repeat(3,auto)] md:grid-cols-[repeat(5,auto)]"
          >
            {jumpLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap text-foreground"
              >
                <span className="underline-offset-4 group-hover:underline">
                  {link.label}
                </span>
                <ArrowDown className="size-3.5 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
              </a>
            ))}
          </nav>
        </div>
      </section>

      <FaqSection groups={faqGroups} />
      <PoliciesSection policies={policies} />
      <SupportSection channels={supportChannels} />
    </>
  )
}
