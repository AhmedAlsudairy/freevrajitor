"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"

// Sample photographers data
const photographers = [
  {
    id: 1,
    name: "Jessica Lee",
    title: "Portrait & Wedding Photographer",
    rating: 4.9,
    reviews: 124,
    hourlyRate: 85,
    location: "New York, NY",
    coordinates: { lat: 40.7128, lng: -74.006 },
    specialties: ["Portrait", "Wedding", "Family"],
    image: "/placeholder.svg?height=300&width=300",
    portfolio: [
      "/placeholder.svg?height=400&width=600&text=Wedding Photo 1",
      "/placeholder.svg?height=400&width=600&text=Portrait 1",
      "/placeholder.svg?height=400&width=600&text=Family Photo 1",
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Commercial & Product Photographer",
    rating: 4.8,
    reviews: 98,
    hourlyRate: 95,
    location: "Los Angeles, CA",
    coordinates: { lat: 34.0522, lng: -118.2437 },
    specialties: ["Product", "Commercial", "Food"],
    image: "/placeholder.svg?height=300&width=300",
    portfolio: [
      "/placeholder.svg?height=400&width=600&text=Product Photo 1",
      "/placeholder.svg?height=400&width=600&text=Food Photo 1",
    ],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "Landscape & Travel Photographer",
    rating: 5.0,
    reviews: 87,
    hourlyRate: 75,
    location: "Seattle, WA",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    specialties: ["Landscape", "Travel", "Nature"],
    image: "/placeholder.svg?height=300&width=300",
    portfolio: [
      "/placeholder.svg?height=400&width=600&text=Landscape 1",
      "/placeholder.svg?height=400&width=600&text=Travel Photo 1",
      "/placeholder.svg?height=400&width=600&text=Nature 1",
    ],
  },
  {
    id: 4,
    name: "David Wilson",
    title: "Event & Corporate Photographer",
    rating: 4.7,
    reviews: 76,
    hourlyRate: 90,
    location: "Chicago, IL",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    specialties: ["Events", "Corporate", "Headshots"],
    image: "/placeholder.svg?height=300&width=300",
    portfolio: [
      "/placeholder.svg?height=400&width=600&text=Event Photo 1",
      "/placeholder.svg?height=400&width=600&text=Corporate 1",
      "/placeholder.svg?height=400&width=600&text=Headshot 1",
    ],
  },
  {
    id: 5,
    name: "Emily Parker",
    title: "Fashion & Editorial Photographer",
    rating: 4.9,
    reviews: 112,
    hourlyRate: 110,
    location: "Miami, FL",
    coordinates: { lat: 25.7617, lng: -80.1918 },
    specialties: ["Fashion", "Editorial", "Portrait"],
    image: "/placeholder.svg?height=300&width=300",
    portfolio: [
      "/placeholder.svg?height=400&width=600&text=Fashion Photo 1",
      "/placeholder.svg?height=400&width=600&text=Editorial 1",
      "/placeholder.svg?height=400&width=600&text=Portrait 2",
    ],
  },
]

// Declare google variable
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function PhotographersPage() {
  const { t, direction } = useLanguage()
  const [selectedPhotographer, setSelectedPhotographer] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [apiKey, setApiKey] = useState<string>("")
  const [mapError, setMapError] = useState<string | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  // Initialize map when Google Maps script is loaded
  const initializeMap = () => {
    if (!mapRef.current) {
      setMapError("Map container not found")
      return
    }

    try {
      // Default center (USA)
      const center = {
        lat: 39.8283,
        lng: -98.5795,
      }

      const mapOptions = {
        center,
        zoom: 4,
        streetViewControl: false,
        mapTypeControl: false,
      }

      const map = new window.google.maps.Map(mapRef.current, mapOptions)
      googleMapRef.current = map

      // Add markers for photographers
      photographers.forEach((photographer) => {
        const marker = new window.google.maps.Marker({
          position: photographer.coordinates,
          map,
          title: photographer.name,
        })

        marker.addListener("click", () => {
          setSelectedPhotographer(photographer)
          map.setCenter(photographer.coordinates)
          map.setZoom(12)
        })

        markersRef.current.push(marker)
      })

      setMapError(null)
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError("Failed to initialize map")
    }
  }

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      try {
        // Fetch API key from server
        const response = await fetch("/api/maps/config")
        const data = await response.json()

        if (!data.apiKey) {
          setMapError("No API key available")
          return
        }

        setApiKey(data.apiKey)

        // Define callback function
        window.initMap = () => {
          setMapLoaded(true)
        }

        // Check if script already exists
        if (document.getElementById("google-maps-script")) {
          if (window.google && window.google.maps) {
            setMapLoaded(true)
          }
          return
        }

        // Create script element
        const script = document.createElement("script")
        script.id = "google-maps-script"
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initMap`
        script.async = true
        script.defer = true

        // Handle errors
        script.onerror = () => {
          setMapError("Failed to load Google Maps script")
        }

        // Add script to document
        document.head.appendChild(script)
      } catch (error) {
        console.error("Error loading Google Maps:", error)
        setMapError("Failed to load map configuration")
      }
    }

    loadGoogleMapsScript()

    // Cleanup function
    return () => {
      // Remove callback
      if (window.initMap) {
        // @ts-ignore
        window.initMap = undefined
      }

      // Clear markers
      if (markersRef.current) {
        markersRef.current.forEach((marker) => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [])

  // Initialize map when script is loaded and tab is active
  useEffect(() => {
    if (mapLoaded && activeTab === "map" && !googleMapRef.current) {
      initializeMap()
    }
  }, [mapLoaded, activeTab])

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("photographers.title")}</h1>
          <p className="text-muted-foreground">{t("photographers.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <Input placeholder={t("photographers.search")} className={direction === "rtl" ? "pr-8" : "pl-8"} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Location</h3>
                  <div className="relative">
                    <MapPin
                      className={`absolute ${direction === "rtl" ? "right-2.5" : "left-2.5"} top-2.5 h-4 w-4 text-muted-foreground`}
                    />
                    <Input
                      placeholder={t("photographers.location")}
                      className={direction === "rtl" ? "pr-8" : "pl-8"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Specialty</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("photographers.specialty")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("photographers.specialty")}</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">{t("photographers.price")}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">{t("photographers.rating")}</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5 & up</SelectItem>
                      <SelectItem value="4.0">4.0 & up</SelectItem>
                      <SelectItem value="3.5">3.5 & up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  {t("photographers.filters")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className={`lg:col-span-2 ${direction === "rtl" ? "lg:order-1" : ""}`}>
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="map">{t("photographers.map")}</TabsTrigger>
              <TabsTrigger value="list">{t("photographers.list")}</TabsTrigger>
            </TabsList>

            <TabsContent value="map">
              <Card className="mb-6">
                <CardContent className="p-0">
                  <div ref={mapRef} id="google-map" className="w-full h-[500px]"></div>

                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <div className="text-center p-4 bg-background rounded-md shadow-md">
                        <Skeleton className="h-8 w-32 mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading map...</p>
                      </div>
                    </div>
                  )}

                  {mapError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <div className="text-center p-4 bg-background rounded-md shadow-md">
                        <p className="text-red-500 font-medium">Error loading map</p>
                        <p className="text-muted-foreground text-sm mt-1">{mapError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setMapError(null)
                            if (mapLoaded) initializeMap()
                          }}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedPhotographer && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="aspect-square relative rounded-md overflow-hidden mb-4">
                          <Image
                            src={selectedPhotographer.image || "/placeholder.svg"}
                            alt={selectedPhotographer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <h2 className="text-xl font-bold">{selectedPhotographer.name}</h2>
                        <p className="text-muted-foreground mb-2">{selectedPhotographer.title}</p>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{selectedPhotographer.rating}</span>
                          <span className="text-muted-foreground">({selectedPhotographer.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {selectedPhotographer.location}
                        </div>

                        <div className="mb-4">
                          <div className="font-medium mb-2">Specialties</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedPhotographer.specialties.map((specialty: string) => (
                              <Badge key={specialty} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="font-medium mb-2">Rate</div>
                          <div className="text-xl font-bold">${selectedPhotographer.hourlyRate}/hr</div>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild>
                            <Link href={`/photographers/${selectedPhotographer.id}`}>{t("photographers.view")}</Link>
                          </Button>
                          <Button variant="outline">{t("photographers.contact")}</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              {photographers.map((photographer) => (
                <Card key={photographer.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <div className="aspect-square md:aspect-auto md:h-full relative">
                          <Image
                            src={photographer.image || "/placeholder.svg"}
                            alt={photographer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold">
                              <Link
                                href={`/photographers/${photographer.id}`}
                                className="hover:text-primary hover:underline"
                              >
                                {photographer.name}
                              </Link>
                            </h3>
                            <p className="text-muted-foreground">{photographer.title}</p>

                            <div className="flex items-center gap-1 mt-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{photographer.rating}</span>
                              <span className="text-muted-foreground">({photographer.reviews} reviews)</span>
                            </div>

                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {photographer.location}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{t("photographers.starting")}</div>
                            <div className="text-xl font-bold">${photographer.hourlyRate}/hr</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="font-medium mb-2">Specialties</div>
                          <div className="flex flex-wrap gap-2">
                            {photographer.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild>
                            <Link href={`/photographers/${photographer.id}`}>{t("photographers.view")}</Link>
                          </Button>
                          <Button variant="outline">{t("photographers.contact")}</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
