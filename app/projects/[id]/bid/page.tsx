"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, DollarSign, FileText, Send, Users, PlusCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/components/auth/client-auth-provider"

// Project type definition
type Project = {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  created_at: string;
  skills: string[];
  client_id: string;
  status: string;
  client?: {
    id: string;
    full_name: string;
    rating?: number;
    reviews_count?: number;
    projects_count?: number;
    joined_date?: string;
    location?: string;
    avatar_url?: string;
  };
  bids_count?: number;
  average_bid?: number;
}

export default function SubmitBidPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const { profile, supabase, user } = useAuth()

  const [bidAmount, setBidAmount] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [existingBids, setExistingBids] = useState<any[]>([])
  
  const projectId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';
  
  // Fetch project data from Supabase
  useEffect(() => {
    async function fetchProject() {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            client:client_id (id, full_name, avatar_url),
            skills:project_skills (*)
          `)
          .eq('id', projectId)
          .single();
          
        if (projectError) throw projectError;
        if (!projectData) {
          setError('Project not found');
          setIsLoading(false);
          return;
        }
        
        // Format project data
        const formattedProject: Project = {
          id: projectData.id,
          title: projectData.title,
          description: projectData.description,
          budget: projectData.budget,
          deadline: projectData.deadline || '30 days',
          created_at: new Date(projectData.created_at).toLocaleDateString(),
          skills: projectData.skills?.map((s: any) => s.skill_name) || [],
          client_id: projectData.client_id,
          status: projectData.status,
          client: projectData.client ? {
            id: projectData.client.id,
            full_name: projectData.client.full_name || 'Anonymous Client',
            avatar_url: projectData.client.avatar_url || '/placeholder.svg?height=80&width=80'
          } : undefined
        };
        
        // Fetch bid statistics
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select('amount')
          .eq('project_id', projectId);
          
        if (!bidsError && bidsData) {
          formattedProject.bids_count = bidsData.length;
          
          if (bidsData.length > 0) {
            const total = bidsData.reduce((sum: number, bid: any) => sum + (parseFloat(bid.amount) || 0), 0);
            formattedProject.average_bid = Math.round(total / bidsData.length);
          }
        }
        
        // If user is a freelancer, check if they already placed a bid
        if (user && profile?.is_freelancer) {
          const { data: userBids } = await supabase
            .from('bids')
            .select('*')
            .eq('project_id', projectId)
            .eq('freelancer_id', user.id);
            
          setExistingBids(userBids || []);
        }
        
        setProject(formattedProject);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.message || 'Failed to load project data');
        setIsLoading(false);
      }
    }
    
    fetchProject();
  }, [projectId, supabase, user, profile?.is_freelancer]);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }
    
    if (!user || !profile?.is_freelancer) {
      toast({
        title: "Error",
        description: "You must be logged in as a freelancer to submit a bid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Insert bid into Supabase
      const { data, error } = await supabase
        .from('bids')
        .insert([
          {
            project_id: projectId,
            freelancer_id: user.id,
            amount: parseFloat(bidAmount),
            delivery_time: parseInt(deliveryTime, 10),
            proposal: coverLetter,
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error

      toast({
        title: "Bid Submitted",
        description: "Your bid has been successfully submitted",
      })

      // Redirect to project page
      router.push(`/projects/${projectId}`)
    } catch (err: any) {
      console.error('Error submitting bid:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to submit bid. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Early return states
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading project details...</span>
        </div>
      </div>
    )
  }
  
  if (error || !project) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center space-y-3">
              <h2 className="text-xl font-semibold text-destructive">Error Loading Project</h2>
              <p className="text-muted-foreground">{error || 'Project not found'}</p>
              <Button asChild variant="secondary">
                <Link href="/projects">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Main return with loaded data
  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("project.back")}
          </Link>
        </Button>
        
        {/* Bid management buttons based on user role */}
        {profile?.is_freelancer && existingBids.length === 0 && (
          <Button 
            size="sm" 
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => document.getElementById('bidForm')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Bid
          </Button>
        )}
        
        {profile?.is_freelancer && existingBids.length > 0 && (
          <Button size="sm" variant="outline" disabled>
            Bid Already Submitted
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Bid Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("bidding.submitBid")}</CardTitle>
            </CardHeader>
            <CardContent id="bidForm">
              {/* Only show form if user is a freelancer and hasn't submitted a bid */}
              {profile?.is_freelancer && existingBids.length === 0 ? (
                <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bid-amount">{t("bidding.bidAmount")}</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="bid-amount"
                        type="number"
                        min="1"
                        className="pl-9"
                        placeholder="Enter your bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("bidding.budget")}: ${project.budget}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-time">{t("bidding.deliveryTime")}</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="delivery-time"
                        type="number"
                        min="1"
                        className="pl-9"
                        placeholder="Enter delivery time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("bidding.due")}: {project.deadline}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover-letter">{t("bidding.coverLetter")}</Label>
                  <Textarea
                    id="cover-letter"
                    placeholder={t("bidding.introduce")}
                    className="min-h-[200px]"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{t("bidding.experience")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">{t("bidding.attachments")}</Label>
                  <Input id="attachments" type="file" multiple onChange={handleAttachmentChange} />
                  <p className="text-xs text-muted-foreground">{t("bidding.uploadWork")}</p>
                  {attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">{t("bidding.selectedFiles")}</p>
                      <ul className="text-sm text-muted-foreground">
                        {attachments.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
                      {t("bidding.agree")}
                    </Label>
                  </div>
                </div>
              </form>
              ) : !profile?.is_freelancer ? (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                  <p className="font-medium text-blue-800 dark:text-blue-300">
                    Only freelancers can submit bids
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Switch to freelancer mode if you want to bid on this project.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">
                    You've already submitted a bid for this project
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    Your bid amount: ${existingBids[0]?.amount} • Delivery time: {existingBids[0]?.delivery_time} days
                  </p>
                </div>
              )
            }</CardContent>
            {profile?.is_freelancer && existingBids.length === 0 && (
              <CardFooter className="flex justify-end">
                <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t("bidding.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t("bidding.submit")}
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Sidebar - Project Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>{t("bidding.projectSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    ${project.budget} {t("bidding.budget")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {project.bids_count || 0} {t("bidding.bids")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("bidding.due")} {project.deadline}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("bidding.posted")} {project.created_at}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />
              
              {/* Bid form for freelancers */}
              {profile?.is_freelancer && existingBids.length === 0 ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bid-amount">{t("bidding.bidAmount")}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="bid-amount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-8"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("bidding.bidAmountHint")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery-time">{t("bidding.deliveryTime")}</Label>
                      <div className="relative">
                        <Input
                          id="delivery-time"
                          type="number"
                          placeholder="Days to complete"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">days</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("bidding.deliveryTimeHint")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover-letter">{t("bidding.coverLetter")}</Label>
                    <Textarea
                      id="cover-letter"
                      placeholder="Explain why you're the best fit for this project"
                      rows={6}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("bidding.coverLetterHint")}
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 mt-4">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t("bidding.termsAgree")}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t("bidding.termsDetail")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t("bidding.submitting")}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t("bidding.submit")}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : !profile?.is_freelancer ? (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                  <p className="font-medium text-blue-800 dark:text-blue-300">
                    Only freelancers can submit bids
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Switch to freelancer mode if you want to bid on this project.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">
                    You've already submitted a bid for this project
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    Your bid amount: ${existingBids[0]?.amount} • Delivery time: {existingBids[0]?.delivery_time} days
                  </p>
                </div>
              )}
            </CardContent>

            {/* Client Information Section */}
            <CardContent className="pt-0 pb-6">
              <Separator className="mb-6" />
              <div>
                <h3 className="font-medium mb-2">{t("bidding.aboutClient")}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={project.client?.avatar_url || '/placeholder.svg?height=80&width=80'} 
                                alt={project.client?.full_name || 'Client'} />
                    <AvatarFallback>{(project.client?.full_name || 'C').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{project.client?.full_name || 'Client'}</div>
                    <div className="text-sm text-muted-foreground">{project.client?.location || 'Location not provided'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("bidding.memberSince")}</span>
                    <span>{project.client?.joined_date || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("bidding.rating")}</span>
                    <span>{project.client?.rating ? `${project.client.rating}/5` : 'No ratings'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("bidding.reviews")}</span>
                    <span>{project.client?.reviews_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("bidding.projects")}</span>
                    <span>{project.client?.projects_count || 0}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">{t("bidding.biddingTips")}</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{t("bidding.tip1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{t("bidding.tip2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{t("bidding.tip3")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{t("bidding.tip4")}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
