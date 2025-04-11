import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    const { userId } = requestData

    // First update the main profile to set is_client flag
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .update({ is_client: true, updated_at: new Date().toISOString() })
      .eq("id", userId);
      
    if (profileError) {
      console.error("Error updating main profile:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    
    // Then check if client profile exists to avoid duplicate insertion
    const { data: existingProfile } = await adminSupabase
      .from("client_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
      
    if (existingProfile) {
      return NextResponse.json({ success: true, message: "Profile already exists" });
    }
    
    // Use the admin client to create the profile
    const { error } = await adminSupabase.from("client_profiles").insert({
      id: userId,
      company_name: "New Client",
      total_spent: 0,
      payment_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    if (error) {
      console.error("Error creating client profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Server error creating client profile:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
