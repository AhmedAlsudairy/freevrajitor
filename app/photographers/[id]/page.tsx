"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, CalendarIcon, MessageSquare, Check, X, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"

// Sample photographer data (in a real app, this would come from an API)
const photographer = {
  id: 1,
  name: "Jessica Lee",
  title: "Portrait & Wedding Photographer",
  bio: "Professional photographer with over 10 years of experience specializing in portrait and wedding photography. I believe in capturing authentic moments that tell your unique story.",
  rating: 4.9,
  reviews: 124,
  hourlyRate: 85,
  location: "New York, NY",
  coordinates: { lat: 40.7128, lng: -74.006 },
  specialties: ["Portrait", "Wedding", "Family"],
  languages: ["English", "Spanish"],
  experience: "10+ years",
  equipment: ["Canon EOS R5", "Various prime lenses", "Professional lighting equipment"],
  image: "/placeholder.svg?height=300&width=300",
  portfolio: [
    {
      id: 1,
      title: "Wedding Photography",
      description: "Elegant wedding at the Plaza Hotel",
      image: "/placeholder.svg?height=400&width=600&text=Wedding Photo 1",
    },
    {
      id: 2,
      title: "Portrait Session",
      description: "Professional headshots for executives",
      image: "/placeholder.svg?height=400&width=600&text=Portrait 1",
    },
    {
      id: 3,
      title: "Family Portraits",
      description: "Family session at Central Park",
      image: "/placeholder.svg?height=400&width=600&text=Family Photo 1",
    },
    {
      id: 4,
      title: "Engagement Photos",
      description: "Couple's engagement session",
      image: "/placeholder.svg?height=400&width=600&text=Engagement Photo",
    },
    {
      id: 5,
      title: "Event Coverage",
      description: "Corporate event photography",
      image: "/placeholder.svg?height=400&width=600&text=Event Photo",
    },
    {
      id: 6,
      title: "Fashion Shoot",
      description: "Editorial fashion photography",
      image: "/placeholder.svg?height=400&width=600&text=Fashion Photo",
    },
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2 months ago",
      comment:
        "Jessica was amazing! She captured our wedding beautifully and was so professional throughout the entire process. Highly recommend!",
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "3 months ago",
      comment:
        "Great experience working with Jessica for our family portraits. She was patient with our kids and the photos turned out fantastic.",
    },
    {
      id: 3,
      user: {
        name: "Emily Wilson",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "4 months ago",
      comment:
        "Jessica did my professional headshots and I couldn't be happier with the results. Very skilled and made me feel comfortable during the shoot.",
    },
  ],
  availability: {
    schedule: "Available weekdays and select weekends",
    nextAvailable: "Next week",
    bookingNotice: "Please book at least 3 days in advance",
  },
}

// Declare google variable
declare global {
  interface Window {
    google: any
    initDetailMap: () => void
  }
}

export default function PhotographerProfilePage({ params }: { params: { id: string } }) {
  const { t, direction } = useLanguage()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [showLightbox, setShowLightbox] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("portfolio")

  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  // Initialize map when Google Maps script is loaded
  const initializeMap = () => {
    if (!mapRef.current || !photographer.coordinates) {
      setMapError("Map container or coordinates not found")
      return
    }

    try {
      const mapOptions = {
        center: photographer.coordinates,
        zoom: 14,
        streetViewControl: false,
        mapTypeControl: false,
      }

      const map = new window.google.maps.Map(mapRef.current, mapOptions)
      googleMapRef.current = map

      // Add marker for photographer location
      const marker = new window.google.maps.Marker({
        position: photographer.coordinates,
        map,
        title: photographer.name,
      })

      markerRef.current = marker
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

        // Define callback function
        window.initDetailMap = () => {
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initDetailMap`
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
      if (window.initDetailMap) {
        // @ts-ignore
        window.initDetailMap = undefined
      }

      // Clear marker
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [])

  // Initialize map when script is loaded and tab is active
  useEffect(() => {
    if (mapLoaded && activeTab === "location" && !googleMapRef.current) {
      initializeMap()
    }
  }, [mapLoaded, activeTab])

  // Handle image click for lightbox
  const openLightbox = (image: any) => {
    setSelectedImage(image)
    setShowLightbox(true)
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/photographers">
          <ArrowLeft className={`h-4 w-4 ${direction === "rtl" ? "ml-2" : "mr-2"}`} />
          {t("photographer.back")}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photographer Info */}
        <div className={`lg:col-span-1 space-y-6 ${direction === "rtl" ? "lg:order-2" : ""}`}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
                  <Image
                    src={photographer.image || "/placeholder.svg"}
                    alt={photographer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="text-2xl font-bold">{photographer.name}</h1>
                <p className="text-muted-foreground mb-2">{photographer.title}</p>

                <div className="flex items-center gap-1 mb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{photographer.rating}</span>
                  <span className="text-muted-foreground">({photographer.reviews?.length} reviews)</span>
                </div>

                <div className="w-full border-t pt-4 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">{t("photographer.rate")}</span>
                    <span className="font-bold">${photographer.hourlyRate}/hr</span>
                  </div>
                  <Button className="w-full">{t("photographer.book")}</Button>
                  <Button variant="outline" className="w-full mt-2">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("photographer.contact")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t("photographer.location")}</h3>
                <div className="flex items-center gap-1 text-sm mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{photographer.location}</span>
                </div>
                <div className="relative w-full h-[200px] rounded-md overflow-hidden">
                  <div ref={mapRef} id="location-map" className="w-full h-full"></div>

                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <Skeleton className="h-6 w-24 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Loading map...</p>
                      </div>
                    </div>
                  )}

                  {mapError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <div className="text-center p-3 bg-background rounded-md shadow-sm">
                        <p className="text-red-500 text-sm font-medium">Error loading map</p>
                        <p className="text-xs text-muted-foreground mt-1">{mapError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("photographer.specialties")}</h3>
                <div className="flex flex-wrap gap-2">
                  {photographer.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("photographer.languages")}</h3>
                <div className="flex flex-wrap gap-2">
                  {photographer.languages.map((language) => (
                    <span key={language} className="text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("photographer.experience")}</h3>
                <p className="text-sm">{photographer.experience}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("photographer.equipment")}</h3>
                <ul className="text-sm space-y-1">
                  {photographer.equipment.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Content */}
        <div className={`lg:col-span-2 space-y-6 ${direction === "rtl" ? "lg:order-1" : ""}`}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{t("photographer.about")}</h2>
              <p className="text-muted-foreground">{photographer.bio}</p>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="portfolio">{t("photographer.portfolio")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("photographer.reviews")}</TabsTrigger>
              <TabsTrigger value="location">{t("photographer.location")}</TabsTrigger>
              <TabsTrigger value="booking">{t("photographer.booking")}</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photographer.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-[4/3] rounded-md overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(item)}
                  >
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-white/80 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{photographer.rating}</span>
                    <span className="text-muted-foreground">({photographer.reviews?.length} reviews)</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Write a Review
                </Button>
              </div>

              <div className="space-y-6">
                {photographer.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.user.image} alt={review.user.name} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.user.name}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="location">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Service Area</h3>
                  <p className="text-muted-foreground mb-4">
                    Based in {photographer.location}, available for travel nationwide with additional fees for
                    international assignments.
                  </p>

                  <div className="relative w-full h-[400px] rounded-md overflow-hidden">
                    <div ref={mapRef} id="location-map-large" className="w-full h-full"></div>

                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <div className="text-center">
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">{t("photographer.booking")}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Select a Date</h4>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="border rounded-md"
                        disabled={(date) => date < new Date()}
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Availability</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{photographer.availability.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Next available: {photographer.availability.nextAvailable}</span>
                          </div>
                          <div className="flex items-center gap-2 text-amber-600">
                            <span>{photographer.availability.bookingNotice}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Session Details</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Session Type</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select session type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="portrait">Portrait Session</SelectItem>
                                <SelectItem value="family">Family Session</SelectItem>
                                <SelectItem value="event">Event Coverage</SelectItem>
                                <SelectItem value="product">Product Photography</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Duration</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 hour</SelectItem>
                                <SelectItem value="2">2 hours</SelectItem>
                                <SelectItem value="3">3 hours</SelectItem>
                                <SelectItem value="4">4 hours</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Additional Notes</label>
                            <Textarea placeholder="Tell the photographer about your needs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <Button className="w-full">{t("photographer.book")}</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative aspect-video">
              <Image
                src={selectedImage.image || "/placeholder.svg"}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-white mt-4">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
