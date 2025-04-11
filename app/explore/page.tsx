import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Filter } from "lucide-react"

// Sample data for services
const services = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `${["Website Development", "Logo Design", "Content Writing", "Digital Marketing"][i % 4]} Service`,
  category: ["Web Development", "Graphics & Design", "Writing & Translation", "Digital Marketing"][i % 4],
  rating: (4 + Math.random()).toFixed(1),
  reviews: Math.floor(Math.random() * 300) + 10,
  price: Math.floor(Math.random() * 300) + 50,
  seller: {
    name: ["Alex Morgan", "Sarah Johnson", "David Wilson", "Emily Parker"][i % 4],
    level: ["Top Rated", "Level 2", "Level 1", "Top Rated"][i % 4],
    image: "/placeholder.svg?height=40&width=40",
  },
  image: `/placeholder.svg?height=320&width=400&text=Service ${i + 1}`,
}))

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="p-4 border rounded-lg sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filter Results</h2>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  Clear all
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-medium mb-2">Category</h3>
                  <div className="space-y-2">
                    {["Web Development", "Graphics & Design", "Writing & Translation", "Digital Marketing"].map(
                      (category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox id={`category-${category}`} />
                          <label htmlFor={`category-${category}`} className="text-sm">
                            {category}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <Slider defaultValue={[50, 300]} min={0} max={1000} step={10} className="mb-6" />
                  <div className="flex space-x-2">
                    <Input type="number" placeholder="Min" className="h-8 text-xs" defaultValue={50} />
                    <Input type="number" placeholder="Max" className="h-8 text-xs" defaultValue={300} />
                  </div>
                </div>

                {/* Seller Level Filter */}
                <div>
                  <h3 className="font-medium mb-2">Seller Level</h3>
                  <div className="space-y-2">
                    {["Top Rated", "Level 2", "Level 1", "New Seller"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={`level-${level}`} />
                        <label htmlFor={`level-${level}`} className="text-sm">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Time Filter */}
                <div>
                  <h3 className="font-medium mb-2">Delivery Time</h3>
                  <div className="space-y-2">
                    {["Up to 1 day", "Up to 3 days", "Up to 7 days", "Any"].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox id={`time-${time}`} />
                        <label htmlFor={`time-${time}`} className="text-sm">
                          {time}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input placeholder="Search services..." className="pl-10" />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by: Recommended" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Best Rating</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 text-sm text-muted-foreground">{services.length} services available</div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={service.seller.image || "/placeholder.svg"}
                          width={24}
                          height={24}
                          alt={service.seller.name}
                          className="rounded-full"
                        />
                        <span className="text-sm">{service.seller.name}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">
                          {service.seller.level}
                        </span>
                      </div>
                      <h3 className="font-medium mb-2 line-clamp-2">{service.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.rating}</span>
                        <span className="text-sm text-muted-foreground">({service.reviews})</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Starting at</span>
                          <span className="font-semibold">${service.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
