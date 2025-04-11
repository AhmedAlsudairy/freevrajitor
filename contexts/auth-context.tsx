"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { User, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Profile type to match your dual-profile system
type Profile = {
  id: string
  is_freelancer: boolean
  is_client: boolean
  [key: string]: any // Allow for other fields
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
  supabase: SupabaseClient<Database>
  signOut: () => Promise<void>
}

// Create a singleton Supabase browser client to prevent multiple instances
const createSupabaseBrowserClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  supabase: createSupabaseBrowserClient(),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseBrowserClient())
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch profile data with the dual-profile system
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) {
        if (profileError.code !== "PGRST116") { // "PGRST116" is no rows returned
          console.error("Error fetching profile:", profileError)
        }
        return null
      }

      return data as Profile
    } catch (err) {
      console.error("Profile fetch error:", err)
      return null
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        
        // Get the current user
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()

        if (userError || !authUser) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        // Set the user
        setUser(authUser)
        
        // Get profile with flags for is_freelancer and is_client
        const profileData = await fetchProfile(authUser.id)
        setProfile(profileData)
      } catch (err: any) {
        console.error("Auth initialization error:", err)
        // Don't set error for expected auth session issues
        if (err.message !== "Auth session missing!") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event)
      setLoading(true)
      
      if (session) {
        // Always verify the user with getUser() for security
        const { data: { user: verifiedUser } } = await supabase.auth.getUser()
        setUser(verifiedUser)
        
        if (verifiedUser) {
          const profileData = await fetchProfile(verifiedUser.id)
          setProfile(profileData)
        }
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    // Clean up subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (err: any) {
      console.error("Sign out error:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, supabase, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
