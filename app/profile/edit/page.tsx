"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/client-auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const { user, supabase, profile: authProfile, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  
  console.log("Auth state:", { user, authProfile, authLoading })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  
  // Form state
  const [formState, setFormState] = useState({
    full_name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    avatar_url: "",
  })
  
  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect after authLoading is complete
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to edit your profile.",
        variant: "destructive",
      })
      router.push("/auth/login")
    }
  }, [user, authLoading, router, toast])
  
  // Initialize form from authProfile if available
  useEffect(() => {
    if (authProfile) {
      console.log("Setting form state from authProfile:", authProfile)
      
      setFormState({
        full_name: authProfile.full_name || "",
        username: authProfile.username || "",
        bio: authProfile.bio || "",
        location: authProfile.location || "",
        website: authProfile.website || "",
        avatar_url: authProfile.avatar_url || "",
      })
      
      setProfile(authProfile)
      setLoading(false)
    }
  }, [authProfile])
  
  // Load the user's profile
  useEffect(() => {
    console.log("Profile fetch useEffect triggered:", { user, profile })
    
    // If we already have a profile from authProfile, no need to fetch again
    if (profile) {
      console.log("Using existing profile, skipping fetch")
      return
    }
    
    if (!user) {
      console.log("No user found in auth context")
      setLoading(false)
      return
    }
    
    async function fetchProfile() {
      try {
        console.log("Starting to fetch profile for user:", user?.id)
        setLoading(true)
        
        // Fetch the main profile
        // Use non-null assertion since we already checked above
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user!.id)
          .single()
          
        console.log("Profile data fetch result:", { profileData, profileError })
          
        if (profileError) {
          throw profileError
        }
        
        if (!profileData) {
          toast({
            title: "Profile not found",
            description: "Could not load your profile. Please try again later.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }
        
        setProfile(profileData)
        
        // Initialize form with profile data
        setFormState({
          full_name: profileData.full_name || "",
          username: profileData.username || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          website: profileData.website || "",
          avatar_url: profileData.avatar_url || "",
        })
        
        // If user is a freelancer, fetch freelancer-specific data
        if (profileData.is_freelancer && user) {
          const { data: freelancerData, error: freelancerError } = await supabase
            .from("freelancer_profiles")
            .select("*")
            .eq("id", user!.id)
            .single()
            
          if (!freelancerError && freelancerData) {
            setProfile((prev: any) => ({ ...prev, ...freelancerData }))
          }
        }
        
        // If user is a client, fetch client-specific data
        if (profileData.is_client && user) {
          const { data: clientData, error: clientError } = await supabase
            .from("client_profiles")
            .select("*")
            .eq("id", user!.id)
            .single()
            
          if (!clientError && clientData) {
            setProfile((prev: any) => ({ ...prev, ...clientData }))
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [user, supabase, toast, router])
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setSaving(true)
      
      // Update the main profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formState.full_name,
          username: formState.username,
          bio: formState.bio,
          location: formState.location,
          website: formState.website,
          avatar_url: formState.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user!.id)
        
      if (updateError) {
        throw updateError
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
      
      // Redirect to profile page using username if available, otherwise use ID
      if (formState.username) {
        router.push(`/profile/${formState.username}`)
      } else {
        router.push(`/profile/${user.id}`)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }
  
  // Show loading indicator while authentication is loading or profile is loading
  if (authLoading || (loading && !profile)) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  // Handle case when no profile data is available
  if (!profile && !loading) {
    return (
      <DashboardLayout>
        <div className="container max-w-4xl py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">We couldn't find your profile information.</p>
            <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formState.full_name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formState.username}
                  onChange={handleInputChange}
                  placeholder="Your username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formState.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formState.location}
                  onChange={handleInputChange}
                  placeholder="Your location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formState.website}
                  onChange={handleInputChange}
                  placeholder="Your website"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={formState.avatar_url}
                  onChange={handleInputChange}
                  placeholder="URL to your avatar image"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push(`/profile/${user?.id || ''}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
