"use client"

import * as React from "react"
import type { User } from "@supabase/supabase-js"

import { supabaseAuth } from "@/lib/auth/supabase-client"

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

function toAuthUser(user: User | null | undefined): AuthUser | null {
  if (!user) return null
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const firstName = typeof meta.first_name === "string" ? meta.first_name : ""
  const lastName = typeof meta.last_name === "string" ? meta.last_name : ""
  const metaFullName =
    typeof meta.full_name === "string" ? meta.full_name.trim() : ""
  const fullName =
    metaFullName || [firstName, lastName].filter(Boolean).join(" ") || (user.email ?? "")
  return {
    id: user.id,
    email: user.email ?? "",
    firstName,
    lastName,
    fullName,
  }
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    supabaseAuth.auth.getSession().then(({ data }) => {
      if (!active) return
      setUser(toAuthUser(data.session?.user))
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user))
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = React.useCallback(async () => {
    await supabaseAuth.auth.signOut()
    setUser(null)
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, loading, signOut }),
    [user, loading, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

export { AuthProvider, useAuth }
export type { AuthUser }
