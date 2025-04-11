import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { createClient } from "@/utils/supabase/server"

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Create a Supabase client with proper cookie handling
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    // Redirect to login if not authenticated - profile views should be public
    // but we'll keep the authentication check for consistency
    if (!user) {
      redirect('/sign-in')
    }
    
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    )
  } catch (error: unknown) {
    console.error('Profile layout auth error:', error instanceof Error ? error.message : String(error))
    // Redirect to login on any auth error
    redirect('/sign-in')
  }
}
