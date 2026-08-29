"use client"

import * as React from "react"
import { Check, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

function Newsletter() {
  const [subscribed, setSubscribed] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (subscribed) return

    setSubscribed(true)
    toast.add({
      title: "You're subscribed!",
      type: "success",
      timeout: 3000,
    })
  }

  return (
    <section className="bg-muted">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-4 py-6 text-center sm:px-6 md:py-10 lg:px-10 xl:px-14">
        <div className="flex size-12 items-center justify-center rounded-full bg-background">
          <Mail className="size-5 text-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Stay in the Loop
        </h2>
        <p className="max-w-md text-pretty text-sm text-muted-foreground sm:text-base">
          Sign up for our newsletter and be the first to hear about new
          arrivals, exclusive deals, and more.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex w-full max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            onChange={() => setSubscribed(false)}
            className="h-11 w-full min-w-0 rounded-md border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-1"
          />
          <Button
            type="submit"
            size="lg"
            variant={subscribed ? "secondary" : "default"}
            disabled={subscribed}
            className="sm:w-auto"
          >
            {subscribed ? (
              <>
                <Check className="size-4" />
                Subscribed
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}

export { Newsletter }
