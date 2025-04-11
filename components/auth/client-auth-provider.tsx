"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Session, User, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Define a profile type that matches your dual-profile system
type Profile = {
  id: string
  is_freelancer: boolean
  is_client: boolean
  [key: string]: any // Allow for other fields
}

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  supabase: SupabaseClient<Database>
  isLoading: boolean
  // Add flag for easy role checking
  isFreelancer: boolean
  isClient: boolean
}

// Create a singleton Supabase browser client
const supabaseBrowserClient = createClient()

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  supabase: supabaseBrowserClient,
  isLoading: true,
  isFreelancer: false,
  isClient: false
})

export function ClientAuthProvider({
  children,
  serverSession,
  serverUser,
}: {
  children: React.ReactNode
  serverSession: Session | null
  serverUser: User | null
}) {
  // Use the browser client for client-side operations
  const [supabase] = useState(() => supabaseBrowserClient)
  
  // Initialize with server-provided values
  const [session, setSession] = useState<Session | null>(serverSession)
  const [user, setUser] = useState<User | null>(serverUser || null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Function to fetch profile data with dual-profile flags
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') { // Not found error code
          const { data: newProfileData, error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              is_freelancer: false,
              is_client: false,
              updated_at: new Date().toISOString()
            })
            .select()
            .single()
            
          if (!createError && newProfileData) {
            setProfile(newProfileData as Profile)
            return
          }
        }
        
        console.error('Error fetching profile:', error)
        return
      }
      
      if (data) {
        setProfile(data as Profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Set up auth state listener and sync with server state
  useEffect(() => {
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state change detected:", event)
      
      if (newSession) {
        // Get fresh user data when session changes
        const { data: userData } = await supabase.auth.getUser()
        setSession(newSession)
        setUser(userData.user)
        
        // Fetch profile data
        if (userData.user) {
          await fetchProfile(userData.user.id)
        }
      } else {
        setSession(null)
        setUser(null)
        setProfile(null)
      }
      
      setIsLoading(false)
    })

    // Initialize auth state if we have a server user
    const initializeAuth = async () => {
      setIsLoading(true)
      try {
        // If we have a server user, fetch their profile
        if (serverUser) {
          await fetchProfile(serverUser.id)
          setIsLoading(false)
          return
        }

        // Otherwise try to get the session
        const { data: { session: clientSession } } = await supabase.auth.getSession()
        
        if (clientSession) {
          const { data: { user: clientUser } } = await supabase.auth.getUser()
          setSession(clientSession)
          setUser(clientUser)
          
          if (clientUser) {
            await fetchProfile(clientUser.id)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAuth()

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, serverSession, serverUser])

  // Derived state for easier role checking
  const isFreelancer = profile?.is_freelancer || false
  const isClient = profile?.is_client || false

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        profile, 
        supabase, 
        isLoading,
        isFreelancer,
        isClient
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
