"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, Filter, Briefcase } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Sample freelancers data
const freelancersData = [
  {
    id: 1,
    name: "Alex Morgan",
    title: "Full Stack Developer & UI/UX Designer",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 65,
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "UI/UX Design"],
    image: "/placeholder.svg?height=300&width=300",
    level: "Top Rated",
    completedProjects: 98,
  },
  {
    id: 2,
    name: "Jessica Lee",
    title: "Graphic Designer & Illustrator",
    rating: 4.8,
    reviews: 93,
    hourlyRate: 55,
    location: "New York, NY",
    skills: ["Graphic Design", "Illustration", "Branding"],
    image: "/placeholder.svg?height=300&width=300",
    level: "Level 2",
    completedProjects: 76,
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "WordPress Developer & SEO Expert",
    rating: 4.7,
    reviews: 85,
    hourlyRate: 45,
    location: "Chicago, IL",
    skills: ["WordPress", "PHP", "SEO"],
    image: "/placeholder.svg?height=300&width=300",
    level: "Level 2",
    completedProjects: 64,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    title: "Content Writer & Marketing Specialist",
    rating: 5.0,
    reviews: 72,
    hourlyRate: 40,
    location: "Austin, TX",
    skills: ["Content Writing", "SEO", "Marketing"],
    image: "/placeholder.svg?height=300&width=300",
    level: "Rising Talent",
    completedProjects: 48,
  },
  {
    id: 5,
    name: "David Wilson",
    title: "Mobile App Developer",
    rating: 4.8,
    reviews: 68,
    hourlyRate: 70,
    location: "Seattle, WA",
    skills: ["React Native", "iOS", "Android"],
    image: "/placeholder.svg?height=300&width=300",
    level: "Top Rated",
    completedProjects: 52,
  },
  {
    id: 6,
    name: "Emily Parker",
    title: "Video Editor & Motion Graphics Designer",
    rating: 4.9,
    reviews: 61,
    hourlyRate: 60,
    location: "Los Angeles, CA",
    skills: ["Video Editing", "After Effects", "Motion Graphics"],
    image: "/placeholder.svg?height=300&width=300",
    level: "Level 1",
    completedProjects: 39,
  },
]

export default function FreelancersPage() {
  const { t, direction } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  // Filter and sort freelancers
  const filteredFreelancers = freelancersData
    .filter((freelancer) => {
      // Search term filter
      if (
        searchTerm &&
        !freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !freelancer.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Skill filter
      if (selectedSkill !== "all" && !freelancer.skills.includes(selectedSkill)) {
        return false
      }

      // Level filter
      if (selectedLevel !== "all" && freelancer.level !== selectedLevel) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "rating") {
        return b.rating - a.rating
      } else if (sortBy === "reviews") {
        return b.reviews - a.reviews
      } else if (sortBy === "price-low") {
        return a.hourlyRate - b.hourlyRate
      } else if (sortBy === "price-high") {
        return b.hourlyRate - a.hourlyRate
      } else if (sortBy === "projects") {
        return b.completedProjects - a.completedProjects
      }
      return 0
    })

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Find Talented Freelancers</h1>
          <p className="text-muted-foreground">
            Discover skilled professionals for your projects from around the world
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/post">Post a Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${direction === "rtl" ? "lg:order-2" : ""}`}>
          <div className="sticky top-20 space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Search</h3>
                  <div className="relative">
                    <Search
                      className={`absolute ${direction === "rtl" ? "right-2.5" : "left-2.5"} top-2.5 h-4 w-4 text-muted-foreground`}
                    />
                    <Input
                      placeholder="Search freelancers..."
                      className={direction === "rtl" ? "pr-8" : "pl-8"}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Skills</h3>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Skills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="Node.js">Node.js</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="WordPress">WordPress</SelectItem>
                      <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                      <SelectItem value="Content Writing">Content Writing</SelectItem>
                      <SelectItem value="Video Editing">Video Editing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Freelancer Level</h3>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Top Rated">Top Rated</SelectItem>
                      <SelectItem value="Level 2">Level 2</SelectItem>
                      <SelectItem value="Level 1">Level 1</SelectItem>
                      <SelectItem value="Rising Talent">Rising Talent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Hourly Rate</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Location</h3>
                  <Input placeholder="Enter location" />
                </div>

                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className={`lg:col-span-3 ${direction === "rtl" ? "lg:order-1" : ""}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <p className="text-muted-foreground">{filteredFreelancers.length} freelancers available</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="grid">
            <TabsList className="mb-6">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFreelancers.map((freelancer) => (
                  <Link key={freelancer.id} href={`/freelancers/${freelancer.id}`}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <Image
                            src={freelancer.image || "/placeholder.svg"}
                            alt={freelancer.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-medium text-white">{freelancer.name}</h3>
                            <p className="text-white/80 text-sm">{freelancer.title}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="font-medium">{freelancer.rating}</span>
                              <span className="text-muted-foreground ml-1">({freelancer.reviews})</span>
                            </div>
                            <Badge variant="outline">{freelancer.level}</Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {freelancer.location}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {freelancer.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {freelancer.completedProjects} projects
                            </div>
                            <div className="font-bold">${freelancer.hourlyRate}/hr</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {filteredFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 relative">
                          <div className="aspect-square md:aspect-auto md:h-full relative">
                            <Image
                              src={freelancer.image || "/placeholder.svg"}
                              alt={freelancer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="p-6 md:w-3/4">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-bold">
                                <Link
                                  href={`/freelancers/${freelancer.id}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {freelancer.name}
                                </Link>
                              </h3>
                              <p className="text-muted-foreground">{freelancer.title}</p>

                              <div className="flex items-center gap-1 mt-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{freelancer.rating}</span>
                                <span className="text-muted-foreground">({freelancer.reviews} reviews)</span>
                                <Badge variant="outline" className="ml-2">
                                  {freelancer.level}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {freelancer.location}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Hourly Rate</div>
                              <div className="text-xl font-bold">${freelancer.hourlyRate}/hr</div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1 justify-end">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {freelancer.completedProjects} projects
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {freelancer.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button asChild>
                              <Link href={`/freelancers/${freelancer.id}`}>View Profile</Link>
                            </Button>
                            <Button variant="outline">Contact</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
