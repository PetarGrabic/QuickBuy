import * as React from "react"
import { CircleAlert } from "lucide-react"

// Shared by the login and signup forms.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1.5 text-sm font-medium text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" />
      {children}
    </p>
  )
}

export { FieldError, EMAIL_RE }
