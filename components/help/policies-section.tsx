import {
  FileText,
  Lock,
  RotateCcw,
  Truck,
  type LucideIcon,
} from "lucide-react"

const POLICIES: {
  icon: LucideIcon
  title: string
  summary: string
}[] = [
  {
    icon: Truck,
    title: "Shipping Policy",
    summary:
      "Orders are processed within one business day. Standard delivery takes 3–5 business days, express 1–2. Shipping is free on orders over $50 within the US and Canada.",
  },
  {
    icon: RotateCcw,
    title: "Returns & Refunds",
    summary:
      "Return most items within 30 days of delivery for a full refund to your original payment method. Items must be unused and in original packaging. Prepaid return labels are provided for every eligible order.",
  },
  {
    icon: Lock,
    title: "Privacy Policy",
    summary:
      "We collect only what we need to process your orders and improve your experience. Your data is never sold, and payment details are handled by PCI-compliant processors — we never store your card number.",
  },
  {
    icon: FileText,
    title: "Terms of Service",
    summary:
      "Using QuickBuy means agreeing to our terms covering pricing accuracy, acceptable use, warranty limitations, and dispute resolution. We'll always notify you before material changes take effect.",
  },
]

function PoliciesSection() {
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
          {POLICIES.map(({ icon: Icon, title, summary }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Icon className="size-5 text-foreground" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground">
                {summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PoliciesSection }
