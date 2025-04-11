"use client"

import { useRef, useState } from "react"
import GoogleMapsWrapper from "./google-maps-wrapper"

interface MapViewProps {
  photographers: any[]
  onMarkerClick?: (photographer: any) => void
  center?: { lat: number; lng: number }
  zoom?: number
}

export default function MapView({
  photographers,
  onMarkerClick,
  center = { lat: 40.7128, lng: -74.006 }, // Default to NYC
  zoom = 10,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [markers, setMarkers] = useState<any[]>([])

  const renderMap = (google: any) => {
    if (!mapRef.current) return null

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    // Create markers for photographers
    const newMarkers = photographers
      .map((photographer) => {
        if (!photographer.location?.coordinates) return null

        const marker = new google.maps.Marker({
          position: {
            lat: photographer.location.coordinates.lat,
            lng: photographer.location.coordinates.lng,
          },
          map,
          title: photographer.name,
          animation: google.maps.Animation.DROP,
        })

        // Add click event
        if (onMarkerClick) {
          marker.addListener("click", () => {
            onMarkerClick(photographer)
          })
        }

        return marker
      })
      .filter(Boolean)

    setMarkers(newMarkers)

    return <div ref={mapRef} className="w-full h-[600px] rounded-lg" />
  }

  return (
    <GoogleMapsWrapper>{(google) => <div ref={mapRef} className="w-full h-[600px] rounded-lg" />}</GoogleMapsWrapper>
  )
}
