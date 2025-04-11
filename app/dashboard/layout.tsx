import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { createClient } from "@/utils/supabase/server"
import type { PostgrestError } from '@supabase/supabase-js'

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Create a Supabase client with proper cookie handling
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    // Redirect to login if not authenticated
    if (!user) {
      redirect('/sign-in')
    }

    // Check if the user has a profile
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_freelancer, is_client')
        .eq('id', user.id)
        .single()
      
      // If user has no profile at all, create a minimal one to prevent errors
      if (profileError || !profileData) {
        // Only create a profile if we get a PGRST116 error (not found)
        if (profileError?.code === 'PGRST116') {
          try {
            const { error: upsertError } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                is_freelancer: false,
                is_client: false,
                updated_at: new Date().toISOString()
              })
            
            if (upsertError) {
              console.error('Error creating default profile:', upsertError)
            }
          } catch (err: unknown) {
            console.error('Error in profile creation:', err instanceof Error ? err.message : String(err))
          }
        } else if (profileError) {
          console.error('Error fetching profile:', profileError)
        }
      }
    } catch (err: unknown) {
      console.error('Error in profile check:', err instanceof Error ? err.message : String(err))
    }
    
    return (
      <DashboardLayout>
        {children}
      </DashboardLayout>
    )
  } catch (error: unknown) {
    console.error('Dashboard layout auth error:', error instanceof Error ? error.message : String(error))
    // Redirect to login on any auth error
    redirect('/sign-in')
  }
}
