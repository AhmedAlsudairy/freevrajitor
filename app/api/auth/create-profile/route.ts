import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    const { userId, username, fullName, email, isFreelancer, isClient } = requestData

    // Use the admin client instead of the route handler client
    const { error } = await adminSupabase.from("profiles").insert({
      id: userId,
      username,
      full_name: fullName,
      email,
      is_freelancer: isFreelancer,
      is_client: isClient,
    })

    if (error) {
      console.error("Error creating profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Server error creating profile:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
