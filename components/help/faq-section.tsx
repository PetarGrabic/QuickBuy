import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_GROUPS: {
  id: string
  title: string
  items: { q: string; a: string }[]
}[] = [
  {
    id: "orders-payment",
    title: "Orders & Payment",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, and PayPal. All payments are processed over a secure, encrypted connection.",
      },
      {
        q: "Can I change or cancel my order after checkout?",
        a: "You can change or cancel an order within 60 minutes of placing it, as long as it hasn't entered fulfilment. Head to Order history, open the order, and choose Edit or Cancel. After that window the order is already being packed and can't be modified.",
      },
      {
        q: "Why was my card declined?",
        a: "The most common reasons are an incorrect billing address, insufficient funds, or your bank flagging an unfamiliar merchant. Double-check the details and try again, or contact your bank to approve the charge.",
      },
      {
        q: "Do you charge sales tax?",
        a: "Tax is calculated at checkout based on your shipping address and the applicable local rate. The final amount is always shown before you confirm payment.",
      },
    ],
  },
  {
    id: "shipping-delivery",
    title: "Shipping & Delivery",
    items: [
      {
        q: "How long will my order take to arrive?",
        a: "Standard shipping takes 3–5 business days. Express shipping takes 1–2 business days when ordered before 2pm local time. Delivery estimates are shown on the product page and again at checkout.",
      },
      {
        q: "How much does shipping cost?",
        a: "Standard shipping is free on orders over $50. Below that it's a flat $4.95. Express shipping is $12.95 regardless of order size.",
      },
      {
        q: "How do I track my package?",
        a: "As soon as your order ships we email you a tracking link. You can also find live tracking under Order history at any time.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within the United States and Canada. We're working on expanding to more regions — join our newsletter to hear when we do.",
      },
    ],
  },
  {
    id: "returns-refunds",
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "Most items can be returned within 30 days of delivery, provided they're unused and in their original packaging. A few categories — perishables, personal-care items, and final-sale products — can't be returned for hygiene reasons.",
      },
      {
        q: "How do I start a return?",
        a: "Open the order in your account, select the items you want to send back, and print the prepaid return label. Drop the parcel at any carrier location within 14 days of creating the label.",
      },
      {
        q: "When will I get my refund?",
        a: "Once your return reaches our warehouse we inspect it within 2 business days and issue the refund to your original payment method. Banks typically take a further 3–5 business days to post it.",
      },
      {
        q: "My item arrived damaged — what should I do?",
        a: "We're sorry about that. Contact support within 7 days with a photo of the damage and your order number, and we'll send a free replacement or a full refund, whichever you prefer.",
      },
    ],
  },
]

function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-2 sm:px-6 md:py-12 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Quick answers to the things shoppers ask us most.
        </p>

        <div className="mt-2 divide-border border-border sm:divide-y sm:border-y md:mt-8">
          {FAQ_GROUPS.map((group, groupIndex) => (
            <div
              key={group.id}
              id={group.id}
              className="scroll-mt-24 py-4 md:grid md:grid-cols-[9.5rem_1fr] md:gap-x-10 md:py-7"
            >
              <h3 className="text-base font-semibold tracking-tight text-foreground md:pt-3.5">
                {group.title}
              </h3>
              <Accordion
                multiple
                className="mt-2 md:mt-0 [&>*:last-child]:border-b-0"
              >
                {group.items.map((item, itemIndex) => (
                  <AccordionItem
                    key={item.q}
                    value={`${groupIndex}-${itemIndex}`}
                  >
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { FaqSection, FAQ_GROUPS }
