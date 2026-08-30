import type { HELP_CENTER_QUERY_RESULT } from "@/sanity.types"

type HelpCenter = NonNullable<HELP_CENTER_QUERY_RESULT>

// Used when the Sanity `helpCenter` singleton is missing or unreachable. Mirrors
// the original hardcoded copy and is the source of truth for seeding Sanity.
export const HELP_FALLBACK = {
  intro: {
    heading: "How can we help?",
    body: "Search our FAQs, review the policies that cover your order, or reach the support team directly.",
  } satisfies HelpCenter["intro"],

  faqGroups: [
    {
      _key: "orders-payment",
      title: "Orders & Payment",
      groupId: "orders-payment",
      items: [
        {
          _key: "op-1",
          question: "Which payment methods do you accept?",
          answer:
            "We accept Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, and PayPal. All payments are processed over a secure, encrypted connection.",
        },
        {
          _key: "op-2",
          question: "Can I change or cancel my order after checkout?",
          answer:
            "You can change or cancel an order within 60 minutes of placing it, as long as it hasn't entered fulfilment. Head to Order history, open the order, and choose Edit or Cancel. After that window the order is already being packed and can't be modified.",
        },
        {
          _key: "op-3",
          question: "Why was my card declined?",
          answer:
            "The most common reasons are an incorrect billing address, insufficient funds, or your bank flagging an unfamiliar merchant. Double-check the details and try again, or contact your bank to approve the charge.",
        },
        {
          _key: "op-4",
          question: "Do you charge sales tax?",
          answer:
            "Tax is calculated at checkout based on your shipping address and the applicable local rate. The final amount is always shown before you confirm payment.",
        },
      ],
    },
    {
      _key: "shipping-delivery",
      title: "Shipping & Delivery",
      groupId: "shipping-delivery",
      items: [
        {
          _key: "sd-1",
          question: "How long will my order take to arrive?",
          answer:
            "Standard shipping takes 3–5 business days. Express shipping takes 1–2 business days when ordered before 2pm local time. Delivery estimates are shown on the product page and again at checkout.",
        },
        {
          _key: "sd-2",
          question: "How much does shipping cost?",
          answer:
            "Standard shipping is free on orders over $50. Below that it's a flat $4.95. Express shipping is $12.95 regardless of order size.",
        },
        {
          _key: "sd-3",
          question: "How do I track my package?",
          answer:
            "As soon as your order ships we email you a tracking link. You can also find live tracking under Order history at any time.",
        },
        {
          _key: "sd-4",
          question: "Do you ship internationally?",
          answer:
            "We currently ship within the United States and Canada. We're working on expanding to more regions — join our newsletter to hear when we do.",
        },
      ],
    },
    {
      _key: "returns-refunds",
      title: "Returns & Refunds",
      groupId: "returns-refunds",
      items: [
        {
          _key: "rr-1",
          question: "What is your return policy?",
          answer:
            "Most items can be returned within 30 days of delivery, provided they're unused and in their original packaging. A few categories — perishables, personal-care items, and final-sale products — can't be returned for hygiene reasons.",
        },
        {
          _key: "rr-2",
          question: "How do I start a return?",
          answer:
            "Open the order in your account, select the items you want to send back, and print the prepaid return label. Drop the parcel at any carrier location within 14 days of creating the label.",
        },
        {
          _key: "rr-3",
          question: "When will I get my refund?",
          answer:
            "Once your return reaches our warehouse we inspect it within 2 business days and issue the refund to your original payment method. Banks typically take a further 3–5 business days to post it.",
        },
        {
          _key: "rr-4",
          question: "My item arrived damaged — what should I do?",
          answer:
            "We're sorry about that. Contact support within 7 days with a photo of the damage and your order number, and we'll send a free replacement or a full refund, whichever you prefer.",
        },
      ],
    },
  ] satisfies HelpCenter["faqGroups"],

  policies: [
    {
      _key: "shipping",
      icon: "truck",
      title: "Shipping Policy",
      summary:
        "Orders are processed within one business day. Standard delivery takes 3–5 business days, express 1–2. Shipping is free on orders over $50 within the US and Canada.",
    },
    {
      _key: "returns",
      icon: "rotate-ccw",
      title: "Returns & Refunds",
      summary:
        "Return most items within 30 days of delivery for a full refund to your original payment method. Items must be unused and in original packaging. Prepaid return labels are provided for every eligible order.",
    },
    {
      _key: "privacy",
      icon: "lock",
      title: "Privacy Policy",
      summary:
        "We collect only what we need to process your orders and improve your experience. Your data is never sold, and payment details are handled by PCI-compliant processors — we never store your card number.",
    },
    {
      _key: "terms",
      icon: "file-text",
      title: "Terms of Service",
      summary:
        "Using QuickBuy means agreeing to our terms covering pricing accuracy, acceptable use, warranty limitations, and dispute resolution. We'll always notify you before material changes take effect.",
    },
  ] satisfies HelpCenter["policies"],

  supportChannels: [
    {
      _key: "email",
      icon: "mail",
      title: "Email us",
      description: "Best for order issues and detailed questions.",
      detail: "support@quickbuy.example",
    },
    {
      _key: "chat",
      icon: "message-circle",
      title: "Live chat",
      description: "Fastest way to reach a person on the team.",
      detail: "Available Mon–Fri,\n9am–6pm ET",
    },
    {
      _key: "phone",
      icon: "phone",
      title: "Call us",
      description: "For urgent problems with an active order.",
      detail: "+1 (555) 010-2400",
    },
    {
      _key: "hours",
      icon: "clock",
      title: "Support hours",
      description: "When our team is online and replying.",
      detail: "Mon–Fri 9am–6pm ET\nSat 10am–4pm ET",
    },
  ] satisfies HelpCenter["supportChannels"],
}
