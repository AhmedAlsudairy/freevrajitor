"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, DollarSign, ExternalLink, MessageSquare, Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/components/auth/client-auth-provider"
import { useToast } from "@/hooks/use-toast"

// Bid type definition
type Bid = {
  id: string;
  project_id: string;
  freelancer_id: string;
  amount: number;
  delivery_time: number;
  proposal: string;
  status: string;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
    client_id: string;
    created_at: string;
    skills: string[];
    client?: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  };
}

export default function BidsPage() {
  const { user, supabase, profile } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  
  const [bids, setBids] = useState<Bid[]>([])
  const [projectRequests, setProjectRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user || !profile) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        if (profile.is_freelancer) {
          // Fetch all bids for the current freelancer with related project data
          const { data: bidsData, error: bidsError } = await supabase
            .from('bids')
            .select(`
              *,
              project:project_id(
                *,
                skills:project_skills(skill:skill_id(name)),
                client:client_id(id, profiles(id, full_name, avatar_url))
              )
            `)
            .eq('freelancer_id', user.id)
            .order('created_at', { ascending: false })
          
          if (bidsError) throw bidsError

          // Format the data to match our Bid type
          const formattedBids = bidsData.map((bid: any) => ({
            ...bid,
            project: bid.project ? {
              ...bid.project,
              skills: bid.project.skills?.map((s: any) => s.skill?.name) || [],
              client: bid.project.client ? {
                id: bid.project.client.id,
                full_name: bid.project.client.profiles?.full_name,
                avatar_url: bid.project.client.profiles?.avatar_url
              } : undefined
            } : undefined
          }))

          setBids(formattedBids)
        } else if (profile.is_client) {
          // Fetch projects created by this client with bid information
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select(`
              *,
              skills:project_skills(skill:skill_id(name)),
              bids(*, freelancer:freelancer_id(id, profiles(id, full_name, avatar_url)))
            `)
            .eq('client_id', user.id)
            .order('created_at', { ascending: false })
          
          if (projectsError) throw projectsError

          // Format the projects data
          const formattedProjects = projectsData.map((project: any) => ({
            ...project,
            skills: project.skills?.map((s: any) => s.skill?.name) || [],
            bids_count: project.bids ? project.bids.length : 0,
            bids: project.bids ? project.bids.map((bid: any) => ({
              ...bid,
              freelancer: bid.freelancer ? {
                id: bid.freelancer.id,
                full_name: bid.freelancer.profiles?.full_name,
                avatar_url: bid.freelancer.profiles?.avatar_url
              } : undefined
            })) : []
          }))

          setProjectRequests(formattedProjects)
        }
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Failed to load data')
        toast({
          title: 'Error',
          description: 'Failed to load your data. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, supabase, profile, toast])
  
  // Filter bids by status for freelancers
  const pendingBids = bids.filter((bid) => bid.status === "pending")
  const acceptedBids = bids.filter((bid) => bid.status === "accepted")
  const rejectedBids = bids.filter((bid) => bid.status === "rejected")
  
  // For clients, we group projects by status or could show projects with bids

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center space-y-3 max-w-md">
            <h3 className="text-lg font-semibold text-destructive">Failed to load data</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Freelancer View */}
        {profile?.is_freelancer && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{t("bids.title")}</h1>
              <Button asChild>
                <Link href="/projects">{t("bids.findProjects")}</Link>
              </Button>
            </div>

            {bids.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-primary mb-1">{pendingBids.length}</div>
                        <div className="text-sm text-muted-foreground">{t("bids.pending")}</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-green-500 mb-1">{acceptedBids.length}</div>
                        <div className="text-sm text-muted-foreground">{t("bids.accepted")}</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-destructive mb-1">{rejectedBids.length}</div>
                        <div className="text-sm text-muted-foreground">{t("bids.rejected")}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="all">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">{t("bids.all")}</TabsTrigger>
                    <TabsTrigger value="pending">{t("bids.pending")}</TabsTrigger>
                    <TabsTrigger value="accepted">{t("bids.accepted")}</TabsTrigger>
                    <TabsTrigger value="rejected">{t("bids.rejected")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <div className="space-y-4">
                      {bids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="pending">
                    <div className="space-y-4">
                      {pendingBids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} />
                      ))}
                      {pendingBids.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">{t("bids.noPending")}</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="accepted">
                    <div className="space-y-4">
                      {acceptedBids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} />
                      ))}
                      {acceptedBids.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">{t("bids.noAccepted")}</div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="rejected">
                    <div className="space-y-4">
                      {rejectedBids.map((bid) => (
                        <BidCard key={bid.id} bid={bid} />
                      ))}
                      {rejectedBids.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">{t("bids.noRejected")}</div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/40 text-center">
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No bids yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  You haven't placed any bids on projects yet. Start exploring available projects and submit your proposals.
                </p>
                <Button asChild>
                  <Link href="/projects">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Find Projects
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}

        {/* Client View */}
        {profile?.is_client && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Project Bids</h1>
              <Button asChild>
                <Link href="/dashboard/projects/create">Create a New Project</Link>
              </Button>
            </div>

            {projectRequests.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Projects with Bids</h2>
                {projectRequests.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">
                            <Link href={`/projects/${project.id}`} className="hover:text-primary hover:underline">
                              {project.title}
                            </Link>
                          </h3>
                          <Badge className="ml-auto">{project.bids_count} bids</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.skills?.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Posted: {new Date(project.created_at).toLocaleDateString()}
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/dashboard/projects/${project.id}/bids`}>View Bids</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/40 text-center">
                <div className="mb-4 p-3 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No project bids yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  You haven't received any bids on your projects yet. Create a new project to attract freelancers.
                </p>
                <Button asChild>
                  <Link href="/dashboard/projects/create">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Create a Project
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Profile Case */}
        {!profile?.is_freelancer && !profile?.is_client && (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/40 text-center">
            <div className="mb-4 p-3 rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Complete your profile first</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              You need to create a freelancer or client profile to access this feature.
            </p>
            <Button asChild>
              <Link href="/profile/edit">
                Complete Your Profile
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

interface BidCardProps {
  bid: Bid
}

function BidCard({ bid }: BidCardProps) {
  const { t } = useLanguage()

  // Format the created_at timestamp to "X days ago" format
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  if (!bid.project) {
    return null // Skip rendering if project data is missing
  }

  return (
    <Card
      className={bid.status === "accepted" ? "border-green-500" : bid.status === "rejected" ? "border-red-300" : ""}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage 
                  src={bid.project.client?.avatar_url || "/placeholder.svg?height=40&width=40"} 
                  alt={bid.project.client?.full_name || "Client"} 
                />
                <AvatarFallback>{(bid.project.client?.full_name || "C").charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{bid.project.client?.full_name || "Client"}</span>

              {bid.status === "pending" && (
                <Badge variant="outline" className="ml-auto">
                  {t("bids.pending")}
                </Badge>
              )}
              {bid.status === "accepted" && <Badge className="bg-green-500 ml-auto">{t("bids.accepted")}</Badge>}
              {bid.status === "rejected" && (
                <Badge variant="destructive" className="ml-auto">
                  {t("bids.rejected")}
                </Badge>
              )}
            </div>

            <h3 className="font-medium text-lg mb-2">
              <Link href={`/projects/${bid.project_id}`} className="hover:text-primary hover:underline">
                {bid.project.title}
              </Link>
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {bid.project.skills && bid.project.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bid.proposal}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("bids.yourBid")}: <span className="font-medium">${bid.amount}</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("bids.delivery")}: <span className="font-medium">{bid.delivery_time} days</span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("bids.bidPlaced")}: <span className="font-medium">{getTimeAgo(bid.created_at)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">{t("bids.projectBudget")}</div>
              <div className="text-xl font-bold">${bid.project.budget}</div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {bid.status === "accepted" && (
                <Button asChild>
                  <Link href={`/dashboard/projects/${bid.project_id}`}>{t("bids.startWorking")}</Link>
                </Button>
              )}

              <Button variant="outline" asChild>
                <Link href={`/projects/${bid.project_id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t("bids.viewProject")}
                </Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href={`/messages?project=${bid.project_id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("bids.contactClient")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
