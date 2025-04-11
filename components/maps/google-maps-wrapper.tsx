"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "@googlemaps/js-api-loader"
import { Skeleton } from "@/components/ui/skeleton"

// This component uses the Google Maps Loader which handles API key security better
// than directly embedding the key in client code
export default function GoogleMapsWrapper({
  children,
  fallback = <Skeleton className="w-full h-[400px] rounded-md" />,
}: {
  children: (google: any) => React.ReactNode
  fallback?: React.ReactNode
}) {
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch a token from our server that will be used to initialize the map
    // This token is not the API key itself but a temporary token for this session
    fetch("/api/maps/token")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to get maps token")
        return res.json()
      })
      .then((data) => {
        const loader = new Loader({
          apiKey: "", // We're not setting the API key here
          version: "weekly",
          libraries: ["places", "geometry"],
          authReferrerPolicy: "origin",
        })

        // The token is added to the URL as a parameter
        loader.url = `${loader.url}&token=${data.token}`

        return loader.load()
      })
      .then((google) => {
        setGoogleMapsLoaded(google)
      })
      .catch((err) => {
        console.error("Error loading Google Maps:", err)
        setError("Failed to load maps. Please try again later.")
      })
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[400px] bg-muted rounded-md">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!googleMapsLoaded) {
    return fallback
  }

  return <>{children(googleMapsLoaded)}</>
}
