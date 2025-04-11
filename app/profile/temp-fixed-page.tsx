"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/client-auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
// Layout is handled by layout.tsx
import { MapPin, Globe, Calendar, Mail, Phone, Clock, Edit, BarChart2, Star, Plus, Loader2 } from "lucide-react"
import type { Database } from "@/types/supabase"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user: currentUser, supabase } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false)

  // Fetch current user and profile data
  useEffect(() => {
    let isMounted = true
    
    async function fetchData() {
      try {
        if (isMounted) setLoading(true)
        
        // Get username from the URL
        const username = params.username as string
        if (!username) {
          console.error("No username provided")
          if (isMounted) {
            setLoading(false)
            toast({
              title: "Error",
              description: "Profile not found.",
              variant: "destructive"
            })
            router.push("/")
          }
          return
        }
        
        // Current user comes from auth context now - no need to fetch
        // Continue as guest view if no current user
        
        // First try to fetch profile by ID if it might be a UUID
        let profileData, profileError;
        
        // Check if the username parameter looks like a UUID
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(username);
        
        if (isUuid) {
          // If it looks like a UUID, try fetching by ID
          const result = await supabase
            .from("profiles")
            .select("*")
            .eq("id", username)
            .single();
            
          profileData = result.data;
          profileError = result.error;
        }
        
        // If not found by ID or not a UUID, try fetching by username
        if (!profileData && (!isUuid || profileError)) {
          const result = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username)
            .single();
            
          profileData = result.data;
          profileError = result.error;
        }
        
        if (profileError) {
          console.error("Error fetching profile:", profileError)
          if (isMounted) {
            setLoading(false)
            toast({
              title: "Profile not found",
              description: "The profile you're looking for doesn't exist.",
              variant: "destructive"
            })
            router.push("/")
          }
          return
        }
        
        if (!profileData) {
          console.error("No profile data returned")
          if (isMounted) {
            setLoading(false)
            toast({
              title: "Profile not found",
              description: "The profile you're looking for doesn't exist.",
              variant: "destructive"
            })
            router.push("/")
          }
          return
        }
        
        if (isMounted) {
          setProfile(profileData)
          
          // Check if this is the current user's profile
          if (currentUser && profileData.id === currentUser.id) {
            setIsCurrentUserProfile(true)
          }
          
          // Fetch freelancer services if this is a freelancer profile
          if (profileData.is_freelancer) {
            try {
              const { data: servicesData, error: servicesError } = await supabase
                .from("services")
                .select("*")
                .eq("user_id", profileData.id)
              
              if (servicesError) {
                console.error("Error fetching services:", servicesError)
              } else if (servicesData) {
                setServices(servicesData)
              }
            } catch (err) {
              console.error("Services fetch error:", err)
            }
          }
          
          // Fetch mock reviews for now
          const mockReviews = [
            {
              id: 1,
              rating: 5,
              content: "A pleasure to work with. Very professional and delivered ahead of schedule.",
              date: "2 months ago",
              user: {
                name: "John Smith",
                image: "https://randomuser.me/api/portraits/men/41.jpg"
              }
            },
            {
              id: 2,
              rating: 4,
              content: "Good communication and quality work. Would hire again.",
              date: "3 months ago",
              user: {
                name: "Lisa Johnson",
                image: "https://randomuser.me/api/portraits/women/65.jpg"
              }
            }
          ]
          
          if (Math.random() > 0.5) {
            setReviews(mockReviews)
          } else {
            setReviews([])
          }
          
          setLoading(false)
        }
      } catch (error) {
        console.error("Profile page error:", error)
        if (isMounted) {
          setLoading(false)
          toast({
            title: "Error",
            description: "Failed to load profile data. Please try again.",
            variant: "destructive"
          })
        }
      }
    }
    
    // Call the async function
    fetchData()
    
    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [params.username, supabase, router, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
                <Image
                  src={profile?.avatar_url || "https://avatars.githubusercontent.com/u/45275283"}
                  alt={profile?.full_name || "User Profile"}
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold">{profile?.full_name || "User"}</h1>
              <p className="text-muted-foreground mt-1">{profile?.title || "Freelancer"}</p>
              
              {profile?.is_freelancer && (
                <div className="flex items-center mt-2 justify-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (profile?.avg_rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({profile?.total_reviews || 0})
                  </span>
                </div>
              )}
              
              <div className="flex items-center mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile?.location || "Location not specified"}</span>
              </div>
              
              <div className="mt-4 flex gap-2">
                {isCurrentUserProfile && (
                  <Button variant="outline" asChild>
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
                
                {!isCurrentUserProfile && (
                  <Button>
                    <Link href={`/messages?user=${profile?.username}`} className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile?.is_freelancer ? "Freelancer" : "Client"}
                  </h2>
                  <p className="text-muted-foreground">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}</p>
                </div>
                {profile?.is_freelancer && (
                  <div>
                    <Badge className="text-md px-3 py-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {profile?.response_time || "1 hr response time"}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">
                  {profile?.bio || "No bio provided."}
                </p>
              </div>
              
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile?.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  
                  {profile?.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {profile?.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  
                  {profile?.is_freelancer && profile?.availability && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.availability}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section - Different tabs based on user role */}
      {profile?.is_freelancer ? (
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          {/* Services Tab - Only for freelancers */}
          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.length > 0 ? (
                services.map((service) => (
                  <Link href={`/gigs/${service.id}`} key={service.id}>
                    <Card className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={service.image_url || `/placeholder.svg?height=320&width=400&text=${encodeURIComponent(service.title)}`}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2 h-12">{service.title}</h3>
                        <div className="flex items-center mt-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(service.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({service.reviews})
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="font-bold">Starting at ${service.price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-3 flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-4">No services available yet.</p>
                  {isCurrentUserProfile && profile.profile_type !== "client" && (
                    <Button asChild>
                      <Link href="/gigs/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create a Service
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-4 border-b last:border-b-0">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image
                              src={review.user.image}
                              alt={review.user.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <div className="font-medium">{review.user.name}</div>
                            <div className="flex items-center">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.education && profile.education.length > 0 ? (
                    <div className="space-y-4">
                      {profile.education.map((edu: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.years}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No education information provided.</p>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.certifications && profile.certifications.length > 0 ? (
                    <div className="space-y-4">
                      {profile.certifications.map((cert: any, index: number) => (
                        <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                          <h3 className="font-semibold">{cert.name}</h3>
                          <p className="text-muted-foreground">{cert.issuer}</p>
                          <p className="text-sm text-muted-foreground">{cert.year}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No certifications provided.</p>
                  )}
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.experience && profile.experience.length > 0 ? (
                    <div className="space-y-6">
                      {profile.experience.map((exp: any, index: number) => (
                        <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-semibold">{exp.title}</h3>
                            <span className="text-sm text-muted-foreground">{exp.years}</span>
                          </div>
                          <p className="text-muted-foreground mb-2">{exp.company}</p>
                          <p>{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No work experience provided.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        /* Client Profile Tabs */
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {profile?.full_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{profile?.bio || "No additional information provided."}</p>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile?.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews from Freelancers</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-4 border-b last:border-b-0">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image
                              src={review.user.image}
                              alt={review.user.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <div className="font-medium">{review.user.name}</div>
                            <div className="flex items-center">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Projects Tab - Only for clients */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock projects for now */}
                  {[1, 2, 3].map((project) => (
                    <div key={project} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-semibold">Project Title {project}</h3>
                        <Badge variant={project % 2 === 0 ? "default" : "outline"}>
                          {project % 2 === 0 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">Posted 2 weeks ago</p>
                      <p className="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">UI/UX</Badge>
                        <Badge variant="secondary">Frontend</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
