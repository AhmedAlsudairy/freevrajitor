"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Briefcase, Users, ChevronDown } from "lucide-react"
import type { Database } from "@/types/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/client-auth-provider"

export function RoleSwitcher() {
  // Get authentication data from the central auth context
  const { user, supabase, isLoading: authLoading, isFreelancer: authIsFreelancer, isClient: authIsClient } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [currentRole, setCurrentRole] = useState<"freelancer" | "client" | null>(null)
  const [isClient, setIsClient] = useState(authIsClient)
  const [isFreelancer, setIsFreelancer] = useState(authIsFreelancer)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run if auth loading is complete
    if (authLoading) return;
    
    const checkUserRoles = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        console.log("Checking roles for user:", user.id)
        
        // Use the isFreelancer and isClient flags directly from the auth context
        setIsClient(authIsClient)
        setIsFreelancer(authIsFreelancer)
        
        // Set current role based on URL path or available roles
        if (window.location.pathname.includes("/gigs") || 
            window.location.pathname.includes("/freelancer")) {
          setCurrentRole("freelancer")
        } else if (window.location.pathname.includes("/projects") || 
                 window.location.pathname.includes("/client")) {
          setCurrentRole("client")
        } else {
          // Default to the first available role
          if (authIsFreelancer) {
            setCurrentRole("freelancer")
          } else if (authIsClient) {
            setCurrentRole("client")
          } else {
            // Default to client if neither role is set
            setCurrentRole("client")
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error checking roles:", error)
        setLoading(false)
      }
    }

    checkUserRoles()
    
  }, [user, authLoading, authIsFreelancer, authIsClient])

  // If user has only one role or is not logged in, don't show the switcher
  if (loading || authLoading || !user || (!isClient && !isFreelancer) || (isClient && !isFreelancer) || (!isClient && isFreelancer)) {
    return null
  }

  const switchRole = async (role: "freelancer" | "client") => {
    try {
      // Safety check to ensure we have a user ID
      if (!user?.id) {
        throw new Error("No authenticated user found")
      }

      setCurrentRole(role)
      
      // Use the appropriate API endpoint based on role
      const endpoint = role === "freelancer" 
        ? '/api/auth/create-freelancer-profile' 
        : '/api/auth/create-client-profile';
      
      // Call the API to set the appropriate flag and create the profile if needed
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error setting ${role} role: ${errorData.error || response.statusText}`);
      }
      
      // Update local state after successful API call
      if (role === "freelancer") {
        setIsFreelancer(true);
        router.push("/dashboard?role=freelancer")
        toast({
          title: "Switched to Freelancer",
          description: "You are now in freelancer mode"
        })
      } else {
        setIsClient(true);
        router.push("/dashboard?role=client")
        toast({
          title: "Switched to Client",
          description: "You are now in client mode"
        })
      }
    } catch (error) {
      console.error("Error switching role:", error)
      toast({
        title: "Error Switching Role",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          {currentRole === "freelancer" ? (
            <>
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Freelancer</span>
            </>
          ) : (
            <>
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Client</span>
            </>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchRole("freelancer")} disabled={currentRole === "freelancer"}>
          <Users className="h-4 w-4 mr-2" />
          Switch to Freelancer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchRole("client")} disabled={currentRole === "client"}>
          <Briefcase className="h-4 w-4 mr-2" />
          Switch to Client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
