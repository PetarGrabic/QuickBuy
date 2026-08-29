import type { Metadata } from "next"
import Link from "next/link"

import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log in · QuickBuy",
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-16 sm:px-6 sm:pb-24 sm:pt-18 lg:max-w-lg">
      <div className="rounded-2xl border border-border bg-background p-7 shadow-sm sm:p-9 lg:p-10">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground lg:text-base">
            Log in to your account to continue shopping.
          </p>
        </div>
        <LoginForm />
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground lg:mt-6 lg:text-base">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
