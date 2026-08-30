"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CircleAlert, Eye, EyeOff } from "lucide-react"

import { supabaseAuth } from "@/lib/auth/supabase-client"
import { useAuth } from "@/lib/auth/auth-context"
import { FieldError, EMAIL_RE } from "@/components/auth/field-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { toast } from "@/components/ui/toast"

// Return to where the user came from, but never to an auth page (and never
// off-site).
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/"
  const path = raw.split(/[?#]/)[0]
  if (path === "/login" || path === "/signup") return "/"
  return raw
}

interface FieldErrors {
  email?: string
  password?: string
  form?: string
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [errors, setErrors] = React.useState<FieldErrors>({})

  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const destination = safeNext(searchParams.get("next"))

  const emailInvalid = Boolean(errors.email || errors.form)
  const passwordInvalid = Boolean(errors.password || errors.form)

  // Already signed in — don't show the form. `scroll: false` lets <ScrollRestorer>
  // put the user back where they were before being bounced to /login.
  React.useEffect(() => {
    if (user) router.replace(destination, { scroll: false })
  }, [user, destination, router])

  function clearFieldError(field: "email" | "password") {
    setErrors((prev) =>
      prev[field] || prev.form ? { ...prev, [field]: undefined, form: undefined } : prev
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const email = (emailRef.current?.value ?? "").trim()
    const password = passwordRef.current?.value ?? ""

    const next: FieldErrors = {}
    if (!email) next.email = "Enter your email address."
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address."
    if (!password) next.password = "Enter your password."

    if (next.email || next.password) {
      setErrors(next)
      if (next.email) emailRef.current?.focus()
      else passwordRef.current?.focus()
      return
    }

    setErrors({})
    setPending(true)
    const { error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    })
    setPending(false)

    if (error) {
      const badCredentials =
        error.code === "invalid_credentials" ||
        /invalid login credentials/i.test(error.message)
      setErrors({
        form: badCredentials
          ? "The email or password you entered is incorrect."
          : error.message || "Something went wrong. Please try again.",
      })
      return
    }

    router.push(destination, { scroll: false })
    router.refresh()
  }

  function handleForgotPassword() {
    toast.add({
      title: "Password reset isn't available yet",
      description: "We're still building this feature — check back soon.",
      type: "info",
      timeout: 4000,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 flex flex-col gap-4 lg:mt-8 lg:gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground lg:text-base">
          Email
        </label>
        <Input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={emailInvalid || undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          onInput={() => clearFieldError("email")}
          className="lg:h-11 lg:text-base"
        />
        {errors.email && <FieldError id="email-error">{errors.email}</FieldError>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground lg:text-base">
          Password
        </label>
        <InputGroup className="lg:h-11">
          <InputGroupInput
            ref={passwordRef}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={passwordInvalid || undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            onInput={() => clearFieldError("password")}
            className="lg:text-base"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              size="icon-xs"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {errors.password && (
          <FieldError id="password-error">{errors.password}</FieldError>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline lg:text-base"
          >
            Forgot password?
          </button>
        </div>
      </div>

      {errors.form && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-2 w-full lg:h-12 lg:text-base"
      >
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  )
}

export { LoginForm }
