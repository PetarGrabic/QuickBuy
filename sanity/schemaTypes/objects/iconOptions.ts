// Curated icon keys shared by the trust bar, policies, and support channels.
// The frontend maps each key to a lucide-react component in lib/sanity/icon-map.tsx —
// keep the two lists in sync.
export const ICON_OPTIONS = [
  { title: "Truck / shipping", value: "truck" },
  { title: "Shield / secure", value: "shield-check" },
  { title: "Return / refresh", value: "rotate-ccw" },
  { title: "Headphones / support", value: "headphones" },
  { title: "Lock / privacy", value: "lock" },
  { title: "Document / terms", value: "file-text" },
  { title: "Mail", value: "mail" },
  { title: "Chat", value: "message-circle" },
  { title: "Phone", value: "phone" },
  { title: "Clock / hours", value: "clock" },
] as const

export type IconKey = (typeof ICON_OPTIONS)[number]["value"]
