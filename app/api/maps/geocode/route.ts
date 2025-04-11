import { NextResponse } from "next/server"

// This endpoint proxies geocoding requests to Google Maps API
// The API key is only used server-side and never exposed to the client
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying geocode request:", error)
    return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
  }
}
