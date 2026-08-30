import {
  Clock,
  FileText,
  Headphones,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react"

import type { IconKey } from "@/sanity/schemaTypes/objects/iconOptions"

// Keep in sync with ICON_OPTIONS in sanity/schemaTypes/objects/iconOptions.ts.
export const ICONS: Record<IconKey, LucideIcon> = {
  truck: Truck,
  "shield-check": ShieldCheck,
  "rotate-ccw": RotateCcw,
  headphones: Headphones,
  lock: Lock,
  "file-text": FileText,
  mail: Mail,
  "message-circle": MessageCircle,
  phone: Phone,
  clock: Clock,
}

/** Resolve a CMS icon key to a lucide component, falling back to Truck. */
export function iconFor(key: string | null | undefined): LucideIcon {
  return (key && ICONS[key as IconKey]) || Truck
}
