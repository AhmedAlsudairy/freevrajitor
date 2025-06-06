import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=${encodeURIComponent(error.message)}`)
    }

    // Check if this is a sign-up confirmation
    const { data: { user } } = await supabase.auth.getUser()
    const isNewUser = user?.created_at && (new Date().getTime() - new Date(user.created_at).getTime() < 300000) // Less than 5 minutes old

    // Add email_verified parameter if this appears to be a new user confirming email
    if (isNewUser && next === '/') {
      return NextResponse.redirect(`${requestUrl.origin}/?email_verified=true`)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
