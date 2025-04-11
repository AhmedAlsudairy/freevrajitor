import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// This endpoint creates a temporary token that can be used to authenticate map requests
// The actual API key is never exposed to the client
export async function GET() {
  try {
    // Create a temporary token that expires in 1 hour
    // This token doesn't contain the API key but is used to authenticate requests
    const token = sign(
      {
        timestamp: Date.now(),
        origin: process.env.VERCEL_URL || "localhost",
      },
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "dummy-key",
      { expiresIn: "1h" },
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generating maps token:", error)
    return NextResponse.json({ error: "Failed to generate maps token" }, { status: 500 })
  }
}
