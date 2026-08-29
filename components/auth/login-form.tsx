"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { toast } from "@/components/ui/toast"

function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.add({
      title: "Login isn't available yet",
      description: "We're still building this feature — check back soon.",
      type: "info",
      timeout: 4000,
    })
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
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 lg:mt-8 lg:gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground lg:text-base"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="lg:h-11 lg:text-base"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground lg:text-base"
          >
            Password
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline lg:text-base"
          >
            Forgot password?
          </button>
        </div>
        <InputGroup className="lg:h-11">
          <InputGroupInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="current-password"
            placeholder="Enter your password"
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
      </div>

      <Button type="submit" size="lg" className="mt-2 w-full lg:h-12 lg:text-base">
        Log in
      </Button>
    </form>
  )
}

export { LoginForm }
