import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

// Mock data for popular services
const popularServices = [
  {
    id: 1,
    title: "Professional WordPress Development",
    category: "Web Development",
    rating: 4.9,
    reviews: 285,
    price: 150,
    seller: {
      name: "Alex Morgan",
      level: "Top Rated",
    },
    image: "/placeholder.svg?height=320&width=400",
  },
  {
    id: 2,
    title: "Logo & Brand Identity Design",
    category: "Graphics & Design",
    rating: 5.0,
    reviews: 176,
    price: 120,
    seller: {
      name: "Sarah Johnson",
      level: "Level 2",
    },
    image: "/placeholder.svg?height=320&width=400",
  },
  {
    id: 3,
    title: "SEO Optimization & Strategy",
    category: "Digital Marketing",
    rating: 4.8,
    reviews: 143,
    price: 200,
    seller: {
      name: "David Wilson",
      level: "Top Rated",
    },
    image: "/placeholder.svg?height=320&width=400",
  },
  {
    id: 4,
    title: "Content Writing for Websites",
    category: "Writing & Translation",
    rating: 4.7,
    reviews: 98,
    price: 80,
    seller: {
      name: "Emily Parker",
      level: "Level 1",
    },
    image: "/placeholder.svg?height=320&width=400",
  },
]

export default function PopularServices() {
  return (
    <section className="py-12 px-4 md:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Popular Pro Services</h2>
          <p className="text-muted-foreground">Find the top-rated services that our freelancers offer</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[4/3] relative">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">{service.category}</div>
                  <h3 className="font-medium mb-2 line-clamp-2">{service.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-sm text-muted-foreground">({service.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{service.seller.name}</span>
                    <span className="font-semibold">${service.price}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/explore" className="text-primary hover:underline font-medium">
            View all services →
          </Link>
        </div>
      </div>
    </section>
  )
}
