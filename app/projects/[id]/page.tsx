"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, DollarSign, MapPin, Users, Star } from "lucide-react"
import BidList from "@/components/bid-list"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

// Sample project data
const projectData = {
  id: "1",
  title: "WordPress E-commerce Website Development",
  description:
    "Looking for an experienced WordPress developer to create an e-commerce website for my small business. The website should have product listings, shopping cart, payment integration, and a blog section.\n\nThe ideal freelancer will have experience with WordPress, WooCommerce, and responsive design. The website should be mobile-friendly and optimized for search engines.\n\nDeliverables:\n- Fully functional e-commerce website\n- Product catalog with categories and filters\n- Shopping cart and secure checkout\n- Payment gateway integration (Stripe and PayPal)\n- User registration and account management\n- Blog section with categories and tags\n- Contact form and about page\n- Basic SEO optimization",
  budget: 1500,
  bids: 12,
  averageBid: 1350,
  deadline: "7 days",
  postedDate: "2 days ago",
  skills: ["WordPress", "WooCommerce", "PHP", "HTML/CSS", "Responsive Design"],
  client: {
    id: 101,
    name: "Sarah Johnson",
    rating: 4.8,
    reviews: 15,
    projects: 23,
    memberSince: "Jan 2022",
    location: "Boston, MA",
    image: "/placeholder.svg?height=80&width=80",
  },
}

// Sample bids data
const bidsData = [
  {
    id: "1",
    freelancer: {
      id: "201",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: 4.9,
      reviews: 87,
      level: "Top Rated",
    },
    amount: 1400,
    deliveryTime: "6 days",
    message:
      "I have extensive experience with WordPress and WooCommerce development. I've built over 30 e-commerce websites with similar requirements. I can deliver a fully functional, responsive, and SEO-optimized website within 6 days.",
    timestamp: "1 day ago",
    status: "pending",
  },
  {
    id: "2",
    freelancer: {
      id: "202",
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: 4.7,
      reviews: 54,
      level: "Level 2",
    },
    amount: 1250,
    deliveryTime: "8 days",
    message:
      "I specialize in WordPress e-commerce solutions and can create a custom website that meets all your requirements. I'll ensure the site is responsive, user-friendly, and optimized for conversions.",
    timestamp: "2 days ago",
    status: "pending",
  },
  {
    id: "3",
    freelancer: {
      id: "203",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: 5.0,
      reviews: 32,
      level: "Rising Talent",
    },
    amount: 1600,
    deliveryTime: "5 days",
    message:
      "I can deliver a premium WordPress e-commerce solution with all the features you need. My expertise in WooCommerce and payment gateway integration ensures a smooth shopping experience for your customers.",
    timestamp: "1 day ago",
    status: "pending",
  },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [bids, setBids] = useState(bidsData)
  const [isClient, setIsClient] = useState(false) // In a real app, this would be determined by auth
  const [activeTab, setActiveTab] = useState("description")

  // In a real app, you would fetch the project data based on the ID
  const project = projectData

  const handleAcceptBid = (bidId: string) => {
    // Update bids with the accepted bid
    const updatedBids = bids.map((bid) =>
      bid.id === bidId ? { ...bid, status: "accepted" as const } : { ...bid, status: "rejected" as const },
    )

    setBids(updatedBids)

    toast({
      title: "Bid Accepted",
      description: "You have successfully accepted this bid",
    })
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("project.back")}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{project.title}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t("bidding.budget")}</div>
                    <div className="text-2xl font-bold">${project.budget}</div>
                  </div>
                  <Button asChild>
                    <Link href={`/projects/${params.id}/bid`}>{t("project.submitBid")}</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    ${project.budget} {t("bidding.budget")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {project.bids} {t("bidding.bids")}
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
                    {t("bidding.posted")} {project.postedDate}
                  </span>
                </div>
              </div>

              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="description">{t("project.description")}</TabsTrigger>
                  <TabsTrigger value="bids">
                    {t("project.bids")} ({bids.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description">
                  <div className="whitespace-pre-line text-muted-foreground">{project.description}</div>
                </TabsContent>

                <TabsContent value="bids">
                  <BidList bids={bids} projectId={project.id} isClient={isClient} onAcceptBid={handleAcceptBid} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>{t("project.aboutClient")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={project.client.image} alt={project.client.name} />
                  <AvatarFallback>{project.client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.client.name}</div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{project.client.rating}</span>
                    <span className="text-muted-foreground ml-1">
                      ({project.client.reviews} {t("bidding.reviews")})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("photographers.location")}</span>
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {project.client.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("bidding.memberSince")}</span>
                  <span>{project.client.memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("bidding.projects")}</span>
                  <span>{project.client.projects}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("project.totalBids")}</span>
                  <span className="font-medium">{project.bids}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("project.averageBid")}</span>
                  <span className="font-medium">${project.averageBid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("project.projectBudget")}</span>
                  <span className="font-medium">${project.budget}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full" asChild>
                  <Link href={`/projects/${params.id}/bid`}>{t("project.submitBid")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
