import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Repeat, Check, AlertCircle } from "lucide-react"

// This would typically be fetched based on the ID
const service = {
  id: 1,
  title: "I will design a professional website for your business",
  description:
    "Looking for a stunning, professional website? Look no further! With over 5 years of experience designing beautiful websites that convert, I'll create a custom website that perfectly represents your brand and helps you achieve your business goals.",
  category: "Web Development",
  rating: 4.9,
  reviews: 285,
  completedOrders: 432,
  price: 150,
  deliveryTime: 3,
  revisions: "Unlimited",
  features: [
    "Responsive design",
    "SEO optimization",
    "5 pages included",
    "Contact form",
    "Social media integration",
    "Source code included",
  ],
  seller: {
    id: 101,
    name: "Alex Morgan",
    level: "Top Rated",
    memberSince: "January 2020",
    responseTime: "1 hour",
    location: "United States",
    image: "/placeholder.svg?height=80&width=80",
    bio: "Experienced web developer with expertise in WordPress, Shopify, and custom web development. Over 400 happy clients worldwide.",
    languages: ["English (Fluent)", "Spanish (Conversational)"],
    skills: ["WordPress", "Shopify", "HTML/CSS", "JavaScript", "PHP"],
  },
  images: [
    "/placeholder.svg?height=600&width=800&text=Website Design 1",
    "/placeholder.svg?height=600&width=800&text=Website Design 2",
    "/placeholder.svg?height=600&width=800&text=Website Design 3",
    "/placeholder.svg?height=600&width=800&text=Website Design 4",
  ],
}

// Sample reviews data
const reviews = [
  {
    id: 1,
    user: {
      name: "Jennifer Lawrence",
      image: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "2 weeks ago",
    content:
      "Alex did an incredible job with my website! He was very responsive and made all the changes I requested promptly. The final result exceeded my expectations. I highly recommend his services!",
  },
  {
    id: 2,
    user: {
      name: "Michael Brown",
      image: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "1 month ago",
    content:
      "Great experience working with Alex. He delivered the project ahead of schedule and was very professional throughout the process. The website looks amazing and works perfectly on all devices.",
  },
  {
    id: 3,
    user: {
      name: "Sarah Wilson",
      image: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    date: "2 months ago",
    content:
      "Good communication and quality work. Would have given 5 stars but there were a few minor revisions needed. Overall very satisfied with the end result.",
  },
]

// Sample packages data
const packages = [
  {
    id: 1,
    name: "Basic",
    price: 150,
    description: "Perfect for small businesses just getting started",
    deliveryTime: 3,
    revisions: "Unlimited",
    features: ["3 pages", "Responsive design", "Contact form", "Basic SEO"],
  },
  {
    id: 2,
    name: "Standard",
    price: 250,
    description: "Most popular option with additional features",
    deliveryTime: 5,
    revisions: "Unlimited",
    features: [
      "5 pages",
      "Responsive design",
      "Contact form",
      "Advanced SEO",
      "Social media integration",
      "Blog setup",
    ],
  },
  {
    id: 3,
    name: "Premium",
    price: 450,
    description: "Comprehensive solution for established businesses",
    deliveryTime: 7,
    revisions: "Unlimited",
    features: [
      "10 pages",
      "Responsive design",
      "Contact form",
      "Advanced SEO",
      "Social media integration",
      "Blog setup",
      "E-commerce functionality",
      "Newsletter signup",
      "Google Analytics setup",
    ],
  },
]

export default function ServicePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Breadcrumbs */}
            <nav className="flex text-sm mb-4">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <Link href="/categories/web-development" className="text-muted-foreground hover:text-primary">
                Web Development
              </Link>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="font-medium">Website Design</span>
            </nav>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{service.title}</h1>

            {/* Seller Info (Mobile) */}
            <div className="flex items-center gap-3 mb-4 lg:hidden">
              <Avatar>
                <AvatarImage src={service.seller.image} alt={service.seller.name} />
                <AvatarFallback>{service.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/sellers/${service.seller.id}`} className="font-medium hover:underline">
                  {service.seller.name}
                </Link>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-muted-foreground ml-1">({service.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-2">
                <Image
                  src={service.images[0] || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {service.images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${service.title} image ${index + 1}`}
                      fill
                      className="object-cover hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="about-seller">About Seller</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({service.reviews})</TabsTrigger>
              </TabsList>

              {/* Description Tab */}
              <TabsContent value="description" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Service Description</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Why choose me?</h3>
                    <ul className="grid gap-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>5+ years of professional experience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>400+ satisfied clients worldwide</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Fast turnaround time and responsive communication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Clean, modern designs that convert visitors into customers</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">What's included</h3>
                    <ul className="grid gap-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* About Seller Tab */}
              <TabsContent value="about-seller" className="pt-4">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={service.seller.image} alt={service.seller.name} />
                      <AvatarFallback>{service.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{service.seller.name}</h3>
                      <p className="text-muted-foreground">{service.seller.bio}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{service.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Member since {service.seller.memberSince}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Seller Stats</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">From</span>
                          <span>{service.seller.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Member since</span>
                          <span>{service.seller.memberSince}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg. response time</span>
                          <span>{service.seller.responseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Completed orders</span>
                          <span>{service.completedOrders}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Languages</h4>
                      <ul className="space-y-1">
                        {service.seller.languages.map((language, index) => (
                          <li key={index} className="text-muted-foreground">
                            {language}
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-medium mt-4">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.seller.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button variant="outline" asChild>
                      <Link href={`/sellers/${service.seller.id}`}>View Full Profile</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-1/3 p-4 bg-muted rounded-lg text-center">
                      <div className="text-4xl font-bold mb-1">{service.rating}</div>
                      <div className="flex justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(service.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{service.reviews} reviews</div>
                    </div>
                    <div className="sm:w-2/3">
                      <h3 className="font-semibold mb-3">Rating Breakdown</h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <div className="w-12 text-sm">{stars} stars</div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${stars === 5 ? 75 : stars === 4 ? 20 : stars === 3 ? 5 : 0}%` }}
                              />
                            </div>
                            <div className="text-sm text-muted-foreground w-10">
                              {stars === 5 ? "75%" : stars === 4 ? "20%" : stars === 3 ? "5%" : "0%"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Recent Reviews</h3>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar>
                              <AvatarImage src={review.user.image} alt={review.user.name} />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
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

                    <div className="mt-4 text-center">
                      <Button variant="outline">Read More Reviews</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Related Services */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((id) => (
                  <Link key={id} href={`/services/${service.id + id}`}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={`/placeholder.svg?height=320&width=400&text=Related Service ${id}`}
                          alt={`Related Service ${id}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground mb-1">Web Development</div>
                        <h3 className="font-medium mb-2 line-clamp-2">
                          I will create a responsive WordPress website for your business
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.8</span>
                          <span className="text-sm text-muted-foreground">(142)</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Starting at</span>
                            <span className="font-semibold">${service.price - 20 + id * 25}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Packages */}
          <div className="lg:w-1/3">
            <div className="sticky top-20">
              <Tabs defaultValue={packages[1].id.toString()} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  {packages.map((pkg) => (
                    <TabsTrigger key={pkg.id} value={pkg.id.toString()}>
                      {pkg.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {packages.map((pkg) => (
                  <TabsContent key={pkg.id} value={pkg.id.toString()}>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{pkg.name} Package</h3>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          </div>
                          <div className="text-xl font-bold">${pkg.price}</div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="flex gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div>
                              <div className="font-medium">Delivery Time</div>
                              <div className="text-sm text-muted-foreground">{pkg.deliveryTime} days</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Repeat className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div>
                              <div className="font-medium">Revisions</div>
                              <div className="text-sm text-muted-foreground">{pkg.revisions}</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <h4 className="font-medium">What's Included</h4>
                          <ul className="space-y-2">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full">Continue (${pkg.price})</Button>
                        <Button variant="outline" className="w-full">
                          Contact Seller
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>

              {/* Seller Info (Desktop) */}
              <Card className="hidden lg:block">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={service.seller.image} alt={service.seller.name} />
                      <AvatarFallback>{service.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/sellers/${service.seller.id}`} className="font-medium hover:underline">
                        {service.seller.name}
                      </Link>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-muted-foreground text-sm ml-1">({service.reviews})</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{service.seller.location}</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mb-2">
                    Contact Me
                  </Button>

                  <div className="text-sm text-center text-muted-foreground mt-3">
                    <AlertCircle className="h-4 w-4 inline-block mr-1" />
                    Response time: typically {service.seller.responseTime}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
