import type React from "react"
import { createClient } from "@/utils/supabase/server"
import type { Database } from "@/types/supabase"
import { ClientAuthProvider } from "./client-auth-provider"

export async function ServerAuthProvider({ children }: { children: React.ReactNode }) {
  try {
    // Create a Supabase client for Server Components using the official pattern
    const supabase = await createClient()

    // Try to get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get the session if user is authenticated
    const { data: { session } } = user 
      ? await supabase.auth.getSession()
      : { data: { session: null } }

    return (
      <ClientAuthProvider serverSession={session} serverUser={user}>
        {children}
      </ClientAuthProvider>
    )
  } catch (error: unknown) {
    console.error('Error in ServerAuthProvider:', error instanceof Error ? error.message : String(error))
    // Provide a fallback with no session/user so the app doesn't crash
    return <ClientAuthProvider serverSession={null} serverUser={null}>{children}</ClientAuthProvider>
  }
}
