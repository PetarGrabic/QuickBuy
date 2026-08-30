import { iconFor } from "@/lib/sanity/icon-map"
import type { HELP_CENTER_QUERY_RESULT } from "@/sanity.types"

type Channels = NonNullable<NonNullable<HELP_CENTER_QUERY_RESULT>["supportChannels"]>

function SupportSection({ channels }: { channels: Channels }) {
  return (
    <section id="contact" className="scroll-mt-24 bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-12 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Still need help?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Our support team typically replies within one business day.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8 lg:grid-cols-4">
          {channels.map((channel) => {
            const Icon = iconFor(channel.icon)
            return (
              <div
                key={channel._key}
                className="flex flex-col rounded-xl border border-border bg-background p-5"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-5 text-foreground" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {channel.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {channel.description}
                </p>
                <p className="mt-3 text-sm font-medium whitespace-pre-line text-pretty text-foreground [overflow-wrap:anywhere]">
                  {channel.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { SupportSection }
