import { NextResponse } from "next/server"

export async function GET() {
  // Return only what's needed for the client
  return NextResponse.json({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  })
}
