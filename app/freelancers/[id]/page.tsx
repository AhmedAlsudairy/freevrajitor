"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Heart,
  MessageSquare,
  Send,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Mock data for the freelancer profile
const freelancerData = {
  id: "1",
  name: "Alex Morgan",
  title: "Full Stack Developer & UI/UX Designer",
  tagline: "Turning ideas into digital reality with clean code and beautiful design",
  rating: 4.9,
  reviews: 127,
  completedProjects: 98,
  hourlyRate: 65,
  totalEarnings: "$45,000+",
  location: "San Francisco, CA",
  memberSince: "January 2020",
  lastActive: "2 hours ago",
  avatar: "/placeholder.svg?height=300&width=300",
  coverImage: "/placeholder.svg?height=600&width=1200&text=Cover Image",
  about:
    "I'm a passionate full-stack developer with over 8 years of experience creating web and mobile applications. I specialize in React, Node.js, and modern JavaScript frameworks, with a strong focus on creating intuitive user experiences and clean, maintainable code.\n\nMy approach combines technical expertise with creative problem-solving to deliver solutions that not only work flawlessly but also delight users. I believe in collaborative development and maintaining clear communication throughout the project lifecycle.",
  skills: [
    { name: "React", level: 95 },
    { name: "Node.js", level: 90 },
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 85 },
    { name: "UI/UX Design", level: 80 },
    { name: "Next.js", level: 85 },
    { name: "MongoDB", level: 75 },
    { name: "PostgreSQL", level: 80 },
    { name: "AWS", level: 70 },
    { name: "Docker", level: 65 },
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Fluent" },
    { name: "French", proficiency: "Conversational" },
  ],
  education: [
    {
      degree: "Master of Computer Science",
      institution: "Stanford University",
      year: "2015-2017",
      description: "Specialized in Human-Computer Interaction and Software Engineering",
    },
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      year: "2011-2015",
      description: "Minor in Design Innovation",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2021",
      expires: "2024",
    },
    {
      name: "Google Professional Cloud Developer",
      issuer: "Google Cloud",
      year: "2020",
      expires: "2023",
    },
    {
      name: "Certified Scrum Master",
      issuer: "Scrum Alliance",
      year: "2019",
      expires: "2023",
    },
  ],
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "TechInnovate Solutions",
      period: "2019 - Present",
      description:
        "Lead developer for enterprise web applications, managing a team of 5 developers. Implemented microservices architecture that improved system performance by 40%.",
    },
    {
      title: "UI/UX Developer",
      company: "Creative Digital Agency",
      period: "2017 - 2019",
      description:
        "Designed and developed user interfaces for clients in finance, healthcare, and e-commerce sectors. Increased client conversion rates by an average of 25%.",
    },
    {
      title: "Frontend Developer",
      company: "StartUp Ventures",
      period: "2015 - 2017",
      description:
        "Developed responsive web applications using React and Angular. Collaborated with UX designers to implement user-centered design principles.",
    },
  ],
  portfolio: [
    {
      id: 1,
      title: "E-commerce Platform",
      category: "Web Development",
      image: "/placeholder.svg?height=400&width=600&text=E-commerce Platform",
      description:
        "A full-featured e-commerce platform with inventory management, payment processing, and analytics dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      link: "https://example.com/project1",
    },
    {
      id: 2,
      title: "Healthcare Management System",
      category: "Web Application",
      image: "/placeholder.svg?height=400&width=600&text=Healthcare App",
      description:
        "A comprehensive healthcare management system for clinics to manage appointments, patient records, and billing.",
      technologies: ["Angular", "Express", "PostgreSQL", "Docker"],
      link: "https://example.com/project2",
    },
    {
      id: 3,
      title: "Financial Dashboard",
      category: "UI/UX Design & Development",
      image: "/placeholder.svg?height=400&width=600&text=Financial Dashboard",
      description:
        "An interactive dashboard for financial data visualization with real-time updates and predictive analytics.",
      technologies: ["React", "D3.js", "Node.js", "WebSockets"],
      link: "https://example.com/project3",
    },
    {
      id: 4,
      title: "Social Media App",
      category: "Mobile Development",
      image: "/placeholder.svg?height=400&width=600&text=Social Media App",
      description:
        "A cross-platform social media application with real-time messaging, content sharing, and user engagement features.",
      technologies: ["React Native", "Firebase", "Redux", "Node.js"],
      link: "https://example.com/project4",
    },
    {
      id: 5,
      title: "Travel Booking Platform",
      category: "Web Development",
      image: "/placeholder.svg?height=400&width=600&text=Travel Platform",
      description:
        "A comprehensive travel booking platform with flight, hotel, and activity reservations, payment processing, and user reviews.",
      technologies: ["Next.js", "GraphQL", "MongoDB", "Stripe"],
      link: "https://example.com/project5",
    },
    {
      id: 6,
      title: "Productivity Tool",
      category: "Web Application",
      image: "/placeholder.svg?height=400&width=600&text=Productivity Tool",
      description: "A team productivity tool with task management, time tracking, and performance analytics features.",
      technologies: ["Vue.js", "Express", "PostgreSQL", "Chart.js"],
      link: "https://example.com/project6",
    },
  ],
  services: [
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "End-to-end web application development with React, Node.js, and modern databases.",
      price: 65,
      deliveryTime: "2-4 weeks",
    },
    {
      id: 2,
      title: "UI/UX Design",
      description: "User-centered design with wireframing, prototyping, and usability testing.",
      price: 55,
      deliveryTime: "1-2 weeks",
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Cross-platform mobile applications using React Native or Flutter.",
      price: 70,
      deliveryTime: "3-5 weeks",
    },
  ],
  reviews: [
    {
      id: 1,
      client: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=50&width=50",
        country: "United States",
      },
      project: "E-commerce Website Development",
      rating: 5,
      date: "June 15, 2023",
      comment:
        "Alex was exceptional to work with! He delivered our e-commerce platform ahead of schedule and exceeded all our expectations. His attention to detail and problem-solving skills are outstanding. We've already hired him for another project.",
      helpful: 24,
      unhelpful: 1,
    },
    {
      id: 2,
      client: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=50&width=50",
        country: "Canada",
      },
      project: "Custom CRM Development",
      rating: 5,
      date: "April 3, 2023",
      comment:
        "Working with Alex was a pleasure. He understood our requirements perfectly and delivered a CRM system that has significantly improved our business operations. His communication was clear and timely throughout the project.",
      helpful: 18,
      unhelpful: 0,
    },
    {
      id: 3,
      client: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=50&width=50",
        country: "Spain",
      },
      project: "Mobile App UI/UX Design",
      rating: 4,
      date: "February 20, 2023",
      comment:
        "Alex created beautiful designs for our mobile app. He was responsive and incorporated our feedback well. The only reason for 4 stars instead of 5 is that we had to request some revisions for the tablet layouts, but he addressed them promptly.",
      helpful: 12,
      unhelpful: 2,
    },
  ],
  stats: {
    jobSuccess: 98,
    onBudget: 100,
    onTime: 95,
    repeatHireRate: 85,
  },
}

export default function FreelancerProfilePage() {
  const params = useParams()
  const { t, direction } = useLanguage()
  const [activePortfolioItem, setActivePortfolioItem] = useState<number | null>(null)
  const [currentReviewPage, setCurrentReviewPage] = useState(1)
  const reviewsPerPage = 3

  // In a real app, you would fetch the freelancer data based on the ID
  const freelancer = freelancerData

  // Calculate review pagination
  const totalReviewPages = Math.ceil(freelancer.reviews.length / reviewsPerPage)
  const currentReviews = freelancer.reviews.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full">
        <Image src={freelancer.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="mb-6 overflow-visible">
              <CardContent className="p-6 pt-0">
                <div className="flex flex-col items-center -mt-16">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold mt-4 text-center">{freelancer.name}</h1>
                  <p className="text-muted-foreground text-center">{freelancer.title}</p>

                  <div className="flex items-center mt-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold ml-1">{freelancer.rating}</span>
                    <span className="text-muted-foreground ml-1">({freelancer.reviews.length} reviews)</span>
                  </div>

                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {freelancer.location}
                  </div>

                  <div className="w-full mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Job Success</span>
                      <span className="font-medium">{freelancer.stats.jobSuccess}%</span>
                    </div>
                    <Progress value={freelancer.stats.jobSuccess} className="h-2" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-bold">${freelancer.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Earnings</span>
                    <span className="font-medium">{freelancer.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Projects</span>
                    <span className="font-medium">{freelancer.completedProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">{freelancer.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium">{freelancer.lastActive}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button className="w-full">Hire Me</Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="ghost" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {freelancer.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="font-medium">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Languages Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {freelancer.languages.map((language, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{language.name}</span>
                      <span className="text-muted-foreground">{language.proficiency}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freelancer.services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                      <h3 className="font-medium">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      <div className="flex justify-between mt-2">
                        <span className="font-bold">${service.price}/hr</span>
                        <span className="text-sm text-muted-foreground">{service.deliveryTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">{freelancer.about}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="portfolio" className="mb-6">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {freelancer.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="group relative cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => setActivePortfolioItem(item.id)}
                    >
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-white/80 text-sm">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portfolio Item Modal */}
                {activePortfolioItem && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-2xl font-bold">
                            {freelancer.portfolio.find((item) => item.id === activePortfolioItem)?.title}
                          </h2>
                          <Button variant="ghost" size="icon" onClick={() => setActivePortfolioItem(null)}>
                            <X className="h-6 w-6" />
                          </Button>
                        </div>

                        <div className="relative aspect-video mb-6">
                          <Image
                            src={freelancer.portfolio.find((item) => item.id === activePortfolioItem)?.image || ""}
                            alt="Portfolio item"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Description</h3>
                            <p className="text-muted-foreground">
                              {freelancer.portfolio.find((item) => item.id === activePortfolioItem)?.description}
                            </p>
                          </div>

                          <div>
                            <h3 className="font-medium">Technologies</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {freelancer.portfolio
                                .find((item) => item.id === activePortfolioItem)
                                ?.technologies.map((tech, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tech}
                                  </Badge>
                                ))}
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button variant="outline" className="flex items-center" asChild>
                              <a
                                href={freelancer.portfolio.find((item) => item.id === activePortfolioItem)?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Project
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {freelancer.experience.map((exp, index) => (
                        <div key={index} className="relative pl-8 pb-8 border-l last:pb-0">
                          <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                          <div className="space-y-2">
                            <h3 className="font-bold text-lg">{exp.title}</h3>
                            <div className="flex items-center text-muted-foreground">
                              <Briefcase className="h-4 w-4 mr-2" />
                              {exp.company}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              {exp.period}
                            </div>
                            <p className="text-muted-foreground mt-2">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {/* Education */}
                      <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                          <GraduationCap className="mr-2 h-5 w-5" />
                          Education
                        </h3>
                        <div className="space-y-6">
                          {freelancer.education.map((edu, index) => (
                            <div key={index} className="relative pl-8 pb-6 border-l last:pb-0">
                              <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                              <div className="space-y-1">
                                <h4 className="font-medium">{edu.degree}</h4>
                                <div className="text-muted-foreground">{edu.institution}</div>
                                <div className="text-sm text-muted-foreground">{edu.year}</div>
                                <p className="text-sm mt-2">{edu.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                          <Award className="mr-2 h-5 w-5" />
                          Certifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {freelancer.certifications.map((cert, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h4 className="font-medium">{cert.name}</h4>
                              <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                              <div className="flex justify-between mt-2 text-sm">
                                <span>Issued: {cert.year}</span>
                                <span>Expires: {cert.expires}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="md:w-1/3 p-4 bg-muted rounded-lg text-center">
                        <div className="text-5xl font-bold mb-2">{freelancer.rating}</div>
                        <div className="flex justify-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(freelancer.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{freelancer.reviews.length} reviews</div>
                      </div>

                      <div className="md:w-2/3">
                        <h3 className="font-semibold mb-4">Client Satisfaction</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-32 text-sm">On Budget</div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${freelancer.stats.onBudget}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium w-12">{freelancer.stats.onBudget}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 text-sm">On Time</div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${freelancer.stats.onTime}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium w-12">{freelancer.stats.onTime}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 text-sm">Repeat Hire Rate</div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${freelancer.stats.repeatHireRate}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium w-12">{freelancer.stats.repeatHireRate}%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-8">
                      {currentReviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.client.avatar} alt={review.client.name} />
                              <AvatarFallback>{review.client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="font-medium">{review.client.name}</div>
                                  <div className="text-sm text-muted-foreground">{review.client.country}</div>
                                </div>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="text-sm font-medium">{review.project}</div>
                                <div className="text-xs text-muted-foreground">{review.date}</div>
                              </div>
                              <p className="mt-2 text-muted-foreground">{review.comment}</p>
                              <div className="mt-3 flex items-center gap-4">
                                <button className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Helpful ({review.helpful})
                                </button>
                                <button className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  Not Helpful ({review.unhelpful})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalReviewPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentReviewPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentReviewPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          {Array.from({ length: totalReviewPages }).map((_, i) => (
                            <Button
                              key={i}
                              variant={currentReviewPage === i + 1 ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentReviewPage(i + 1)}
                            >
                              {i + 1}
                            </Button>
                          ))}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentReviewPage((prev) => Math.min(prev + 1, totalReviewPages))}
                            disabled={currentReviewPage === totalReviewPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Write a Review */}
                    <div className="mt-8">
                      <h3 className="font-semibold mb-4">Write a Review</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm mb-2">Your Rating</div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-6 w-6 cursor-pointer text-muted-foreground hover:text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm mb-2">Your Review</div>
                          <Textarea
                            placeholder="Share your experience working with this freelancer..."
                            className="min-h-[120px]"
                          />
                        </div>
                        <Button className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
