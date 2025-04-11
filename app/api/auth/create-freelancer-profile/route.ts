import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    const { userId } = requestData

    // First update the main profile to set is_freelancer flag
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .update({ is_freelancer: true, updated_at: new Date().toISOString() })
      .eq("id", userId);
      
    if (profileError) {
      console.error("Error updating main profile:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
    
    // Then check if freelancer profile exists to avoid duplicate insertion
    const { data: existingProfile } = await adminSupabase
      .from("freelancer_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
      
    if (existingProfile) {
      return NextResponse.json({ success: true, message: "Profile already exists" });
    }
    
    // Use the admin client to create the profile
    const { error } = await adminSupabase.from("freelancer_profiles").insert({
      id: userId,
      title: "New Freelancer",
      hourly_rate: null,
      total_earnings: 0,
      job_success_score: 0,
      member_since: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    if (error) {
      console.error("Error creating freelancer profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Server error creating freelancer profile:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
