import {
  Clock,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react"

const SUPPORT_CHANNELS: {
  icon: LucideIcon
  title: string
  description: string
  detail: string
}[] = [
  {
    icon: Mail,
    title: "Email us",
    description: "Best for order issues and detailed questions.",
    detail: "support@quickbuy.example",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    description: "Fastest way to reach a person on the team.",
    detail: "Available Mon–Fri,\n9am–6pm ET",
  },
  {
    icon: Phone,
    title: "Call us",
    description: "For urgent problems with an active order.",
    detail: "+1 (555) 010-2400",
  },
  {
    icon: Clock,
    title: "Support hours",
    description: "When our team is online and replying.",
    detail: "Mon–Fri 9am–6pm ET\nSat 10am–4pm ET",
  },
]

function SupportSection() {
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
          {SUPPORT_CHANNELS.map(({ icon: Icon, title, description, detail }) => (
            <div
              key={title}
              className="flex flex-col rounded-xl border border-border bg-background p-5"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Icon className="size-5 text-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              <p className="mt-3 text-sm font-medium whitespace-pre-line text-pretty text-foreground [overflow-wrap:anywhere]">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { SupportSection }
