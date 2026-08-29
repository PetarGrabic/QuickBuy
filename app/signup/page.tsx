import type { Metadata } from "next"
import Link from "next/link"

import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign up — QuickBuy",
}

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-16 sm:px-6 sm:pb-24 sm:pt-18 lg:max-w-lg">
      <div className="rounded-2xl border border-border bg-background p-7 shadow-sm sm:p-9 lg:p-10">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground lg:text-base">
            Sign up to start shopping with QuickBuy.
          </p>
        </div>
        <SignupForm />
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground lg:mt-6 lg:text-base">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
