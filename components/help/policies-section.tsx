import { iconFor } from "@/lib/sanity/icon-map"
import type { HELP_CENTER_QUERY_RESULT } from "@/sanity.types"

type Policies = NonNullable<NonNullable<HELP_CENTER_QUERY_RESULT>["policies"]>

function PoliciesSection({ policies }: { policies: Policies }) {
  return (
    <section id="policies" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-12 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Our policies
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          The short version of how we handle shipping, returns, and your data.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8">
          {policies.map((policy) => {
            const Icon = iconFor(policy.icon)
            return (
              <div
                key={policy._key}
                className="rounded-xl border border-border bg-background p-5"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-5 text-foreground" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {policy.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">
                  {policy.summary}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { PoliciesSection }
