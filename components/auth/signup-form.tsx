"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

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

interface SignupErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function SignupForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [errors, setErrors] = React.useState<SignupErrors>({})

  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const confirmRef = React.useRef<HTMLInputElement>(null)

  function clearFieldError(field: keyof SignupErrors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    const name = (nameRef.current?.value ?? "").trim()
    const email = (emailRef.current?.value ?? "").trim()
    const password = passwordRef.current?.value ?? ""
    const confirmPassword = confirmRef.current?.value ?? ""

    const next: SignupErrors = {}
    if (!name) next.name = "Enter your full name."
    if (!email) next.email = "Enter your email address."
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address."
    if (!password) next.password = "Create a password."
    else if (password.length < 8) next.password = "Use at least 8 characters."
    if (!confirmPassword) next.confirmPassword = "Re-enter your password."
    else if (password && confirmPassword !== password)
      next.confirmPassword = "Passwords don't match."

    if (Object.keys(next).length > 0) {
      setErrors(next)
      const firstInvalid = next.name
        ? nameRef
        : next.email
          ? emailRef
          : next.password
            ? passwordRef
            : confirmRef
      firstInvalid.current?.focus()
      return
    }

    // Nothing to submit to yet — just clear the form and confirm with a toast.
    setErrors({})
    form.reset()
    setShowPassword(false)
    setShowConfirmPassword(false)
    toast.add({
      title: "Signup isn't available yet",
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
        <label
          htmlFor="name"
          className="text-sm font-medium text-foreground lg:text-base"
        >
          Full name
        </label>
        <Input
          ref={nameRef}
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          onInput={() => clearFieldError("name")}
          className="lg:h-11 lg:text-base"
        />
        {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground lg:text-base"
        >
          Email
        </label>
        <Input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          onInput={() => clearFieldError("email")}
          className="lg:h-11 lg:text-base"
        />
        {errors.email && <FieldError id="email-error">{errors.email}</FieldError>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground lg:text-base"
        >
          Password
        </label>
        <InputGroup className="lg:h-11">
          <InputGroupInput
            ref={passwordRef}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={errors.password ? true : undefined}
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
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirm-password"
          className="text-sm font-medium text-foreground lg:text-base"
        >
          Confirm password
        </label>
        <InputGroup className="lg:h-11">
          <InputGroupInput
            ref={confirmRef}
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={errors.confirmPassword ? true : undefined}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            onInput={() => clearFieldError("confirmPassword")}
            className="lg:text-base"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              size="icon-xs"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {errors.confirmPassword && (
          <FieldError id="confirm-password-error">
            {errors.confirmPassword}
          </FieldError>
        )}
      </div>

      <Button type="submit" size="lg" className="mt-2 w-full lg:h-12 lg:text-base">
        Create account
      </Button>
    </form>
  )
}

export { SignupForm }
