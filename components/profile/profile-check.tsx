"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Briefcase, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/client-auth-provider"

interface ProfileCheckProps {
  children: React.ReactNode
  requiredType?: "freelancer" | "client" | "any"
}

// Debug helper function
function debugLog(...args: any[]) {
  console.log("[ProfileCheck]", ...args)
}

export function ProfileCheck({ children, requiredType = "any" }: ProfileCheckProps) {
  const router = useRouter()
  const { toast } = useToast()
  // Use the auth context to get the authenticated user and supabase client
  const { user: authUser, supabase, isLoading: authLoading, profile: authProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [hasRequiredProfile, setHasRequiredProfile] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [debugState, setDebugState] = useState<string>("initializing")
  const [userId, setUserId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isFreelancer, setIsFreelancer] = useState(false)
  
  useEffect(() => {
    let isMounted = true
    setDebugState("useEffect started")
    debugLog("ProfileCheck useEffect started, requiredType:", requiredType)
    
    async function checkProfile() {
      if (!isMounted) {
        debugLog("Component unmounted before checkProfile ran")
        return
      }
      
      // Use the user from the auth context instead of making a separate auth request
      if (authLoading) {
        debugLog("Auth still loading, waiting...")
        return; // Wait for auth to finish loading
      }
      
      try {
        if (!authUser) {
          debugLog("No authenticated user from auth context")
          if (isMounted) {
            setDebugState("no user")
            setErrorMessage("You need to be logged in to access this page.")
            setIsLoading(false)
          }
          return
        }
        
        setUserId(authUser.id)
        debugLog("User authenticated from context:", authUser.id)
        
        // Check if basic profile exists
        setDebugState("fetching profile")
        debugLog("Fetching profile for user ID:", authUser.id)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single()
        
        if (profileError) {
          debugLog("Profile fetch error:", profileError)
          if (isMounted) {
            if (profileError.code === "PGRST116") { // Not found
              debugLog("Profile not found (PGRST116)")
              setDebugState("profile not found")
              setHasProfile(false)
            } else {
              debugLog("Other profile error")
              setDebugState("profile fetch error")
              setErrorMessage(`Error fetching profile data: ${profileError.message}`)
            }
            setIsLoading(false)
          }
          return
        }
        
        if (!profile) {
          debugLog("No profile data returned")
          if (isMounted) {
            setDebugState("no profile")
            setHasProfile(false)
            setIsLoading(false)
          }
          return
        }
        
        debugLog("Profile found:", profile)
        if (isMounted) {
          setDebugState("profile found")
          setHasProfile(true)
          
          // Store the current roles for reference
          setIsClient(!!profile.is_client)
          setIsFreelancer(!!profile.is_freelancer)
          
          // For freelancer/client checks, use the profile flags instead of separate tables
          if (requiredType === "any") {
            debugLog("Required type is 'any', allowing access")
            setDebugState("any type ok")
            setHasRequiredProfile(true)
          } else if (requiredType === "freelancer") {
            debugLog("Required type is 'freelancer', checking is_freelancer flag:", profile.is_freelancer)
            setDebugState("checking freelancer")
            // Check is_freelancer flag from the main profiles table
            setHasRequiredProfile(!!profile.is_freelancer)
          } else if (requiredType === "client") {
            debugLog("Required type is 'client', checking is_client flag:", profile.is_client)
            setDebugState("checking client")
            // Check is_client flag from the main profiles table
            setHasRequiredProfile(!!profile.is_client)
          }
          
          debugLog("Profile check complete. hasRequiredProfile:", !!profile.is_freelancer)
          setDebugState("check complete")
        }
      } catch (error) {
        debugLog("Profile check unexpected error:", error)
        if (isMounted) {
          setDebugState("unexpected error")
          setErrorMessage(`Unexpected error checking profile: ${error instanceof Error ? error.message : String(error)}`)
          setHasProfile(false)
          setHasRequiredProfile(false)
        }
      } finally {
        if (isMounted) {
          debugLog("Setting loading to false, final state:", { 
            hasProfile, 
            hasRequiredProfile,
            debugState
          })
          setIsLoading(false)
        }
      }
    }
    
    // Run without delay - the delay might be causing issues
    debugLog("Running checkProfile immediately")
    if (!authLoading) {
      checkProfile()
    }
    
    return () => {
      debugLog("ProfileCheck component unmounting, cleaning up")
      isMounted = false
    }
  }, [supabase, router, requiredType, authUser, authLoading])
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex items-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Checking your profile...</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Debug state: {debugState}
        </div>
      </div>
    )
  }
  
  if (errorMessage) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{errorMessage}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  if (!hasProfile) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Please set up your profile before continuing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              We need some basic information to get you started. This will only take a minute.
            </p>
            <div className="text-xs text-muted-foreground mt-4">
              Debug state: {debugState}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/profile/create")} className="w-full">
              Create Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  if (!hasRequiredProfile && requiredType !== "any") {
    // Helper function to become a specific role
    const activateRole = async (role: "freelancer" | "client") => {
      if (!userId) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in first",
          variant: "destructive"
        })
        return
      }
      
      try {
        setIsLoading(true)
        debugLog(`Activating ${role} role for user ${userId}`)
        
        // First check if we have permission to modify the profiles table
        const { data: profileCheck, error: checkError } = await supabase
          .from("profiles")
          .select("id, is_freelancer, is_client")
          .eq("id", userId)
          .maybeSingle()
          
        if (checkError) {
          debugLog("Error checking profile access:", checkError)
          throw new Error("Could not verify profile access: " + checkError.message)
        }
        
        if (!profileCheck) {
          debugLog("Profile not found")
          // Create the profile if it doesn't exist
          const { error: createError } = await supabase
            .from("profiles")
            .insert({ 
              id: userId,
              is_freelancer: role === "freelancer",
              is_client: role === "client"
            })
            
          if (createError) {
            debugLog("Error creating profile:", createError)
            throw new Error("Could not create profile: " + createError.message)
          }
        } else {
          // Update the main profile
          const updateData = role === "freelancer" 
            ? { is_freelancer: true } 
            : { is_client: true }
            
          const { error: profileError } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", userId)
            
          if (profileError) {
            debugLog("Error updating profile:", profileError)
            throw new Error("Could not update profile: " + profileError.message)
          }
        }
        
        // Check if specialized profile exists
        const tableName = role === "freelancer" ? "freelancer_profiles" : "client_profiles"
        const { data: existingProfile, error: fetchError } = await supabase
          .from(tableName)
          .select("id")
          .eq("id", userId)
          .maybeSingle() // Use maybeSingle instead of single to avoid errors
          
        if (fetchError) {
          debugLog(`Error checking ${role} profile:`, fetchError)
          throw new Error(`Could not check ${role} profile: ${fetchError.message}`)
        }
        
        // Create specialized profile if it doesn't exist
        if (!existingProfile) {
          const { error: specializedProfileError } = await supabase
            .from(tableName)
            .insert({
              id: userId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            
          if (specializedProfileError) {
            debugLog(`Error creating ${role} profile:`, specializedProfileError)
            throw new Error(`Could not create ${role} profile: ${specializedProfileError.message}`)
          }
        }
        
        // Update local state
        if (role === "freelancer") {
          setIsFreelancer(true)
        } else {
          setIsClient(true)
        }
        setHasRequiredProfile(true)
        
        toast({
          title: `${role === "freelancer" ? "Freelancer" : "Client"} Status Activated`,
          description: `You can now access ${role} features!`
        })
        
        // Short delay to allow the toast to be seen before reload
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (error) {
        console.error(`Error activating ${role} role:`, error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : `Failed to activate ${role} status. Please try again.`,
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }
    
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>Additional Profile Required</CardTitle>
            <CardDescription>
              {requiredType === "freelancer" 
                ? "You need a freelancer profile to access this feature." 
                : "You need a client profile to access this feature."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {requiredType === "freelancer"
                ? "Create a freelancer profile to start offering services and bidding on projects."
                : "Create a client profile to post projects and hire freelancers."}
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                {requiredType === "freelancer" ? (
                  <>
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Become a Freelancer</h3>
                      <p className="text-sm text-muted-foreground">Offer services and get hired for projects</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Briefcase className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Become a Client</h3>
                      <p className="text-sm text-muted-foreground">Post projects and hire talent</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center mt-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-4">
                Debug state: {debugState}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={() => activateRole(requiredType as "freelancer" | "client")} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>Activate {requiredType === "freelancer" ? "Freelancer" : "Client"} Account</>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/profile/${requiredType}`)} 
              className="w-full"
              disabled={isLoading}
            >
              Set Up Complete Profile
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push("/dashboard")} 
              className="w-full"
              disabled={isLoading}
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return <>{children}</>
}
