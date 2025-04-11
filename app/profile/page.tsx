"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth/client-auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/dashboard-layout";
import { 
  MapPin, 
  Calendar, 
  Edit, 
  Star, 
  BarChart2, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  Plus,
  Loader2 
} from "lucide-react";
import type { Database } from "@/types/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const { user, supabase, profile: authProfile, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchUserProfile() {
      try {
        if (isMounted) setLoading(true);
        
        // User and profile data now comes from the auth context
        // No need to fetch the user again
        if (!user) {
          console.log('No user found, redirecting to login');
          if (isMounted) setLoading(false);
          router.push('/login');
          return;
        }
        
        // User profile comes from our auth context
        if (!authProfile) {
          console.log('No profile found, user may need to create one');
          if (isMounted) setLoading(false);
          router.push('/profile/create');
          return;
        }
        
        // Set loading to false BEFORE redirect
        if (isMounted) setLoading(false);
        
        // Redirect to the username-based profile page
        if (authProfile.username) {
          // Use replace instead of push to avoid browser history issues
          router.replace(`/profile/${authProfile.username}`);
        }
      } catch (error) {
        console.error('Error:', error);
        if (isMounted) setLoading(false);
      }
    }
    
    // Only run if auth loading has completed
    if (!authLoading) {
      fetchUserProfile();
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [router, user, authProfile, authLoading]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
                  <Image src={profile?.image || "/placeholder.svg"} alt={profile?.name || "User"} fill className="object-cover" />
                </div>
                <h1 className="text-2xl font-bold">{profile?.name || "User"}</h1>
                <p className="text-muted-foreground mb-2">{profile?.title || ""}</p>
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{profile?.rating || "0.0"}</span>
                  <span className="text-muted-foreground ml-1">({profile?.reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile?.location || "Not specified"}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {profile?.memberSince || "N/A"}
                </div>
                <Button className="w-full mb-2" asChild>
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>

              <div className="md:w-2/3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <BarChart2 className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">{profile?.completedProjects || 0}</span>
                      <span className="text-sm text-muted-foreground">Projects Completed</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Star className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">{profile?.rating || "0.0"}</span>
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Clock className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">{profile?.responseTime || "N/A"}</span>
                      <span className="text-sm text-muted-foreground">Response Time</span>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">About Me</h2>
                    <p className="text-muted-foreground">{profile?.bio || "No bio available."}</p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Languages</h2>
                      <ul className="space-y-1 text-muted-foreground">
                        {profile?.languages?.map((language: string, index: number) => (
                          <li key={index}>{language}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
                      <div className="space-y-2 text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          alex.morgan@example.com
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          +1 (555) 123-4567
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          www.alexmorgan.dev
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">
              Services
              <Badge className="ml-2" variant="secondary">
                {services.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews
              <Badge className="ml-2" variant="secondary">
                {reviews.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2 line-clamp-2">{service.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating}</span>
                      <span className="text-sm text-muted-foreground">({service.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Starting at</span>
                      <span className="font-semibold">${service.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-2">Create a New Service</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a new service to showcase your skills and attract more clients
                  </p>
                  <Button asChild>
                    <Link href="/gigs/create">Create Service</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="pt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Client Reviews</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium text-lg">{profile?.rating || "0.0"}</span>
                    <span className="text-muted-foreground ml-1">({profile?.reviews || 0} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Image
                          src={review.user.image || "/placeholder.svg"}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.education?.map((edu: any, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile?.certifications?.map((cert: any, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium">{cert.name}</h3>
                        <p className="text-muted-foreground">{cert.issuer}</p>
                        <p className="text-sm text-muted-foreground">{cert.year}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Senior Web Developer</h3>
                      <p className="text-muted-foreground">TechSolutions Inc.</p>
                      <p className="text-sm text-muted-foreground">2020 - Present</p>
                      <p className="mt-2">
                        Lead developer for client projects, specializing in WordPress and React applications. Managed a
                        team of 3 junior developers and delivered over 50 successful projects.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium">Web Developer</h3>
                      <p className="text-muted-foreground">Digital Creations Agency</p>
                      <p className="text-sm text-muted-foreground">2018 - 2020</p>
                      <p className="mt-2">
                        Developed responsive websites and web applications for clients across various industries.
                        Specialized in front-end development using HTML, CSS, and JavaScript.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
