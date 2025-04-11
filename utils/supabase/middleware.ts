import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export async function updateSession(request: NextRequest) {
  // Create a new response that will be modified with cookies
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // First set cookies in the request for subsequent middleware
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          
          // Create a new response with the updated request
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Set cookies in the response to be sent to the browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set({
              name,
              value,
              ...options,
              // Ensure consistent security settings
              path: options?.path || '/',
              sameSite: options?.sameSite || 'lax',
              httpOnly: options?.httpOnly !== false,
              secure: process.env.NODE_ENV === 'production',
            })
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  // This line is critical for keeping the session active
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/sign-in') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/' && // Home page is public
    !request.nextUrl.pathname.startsWith('/_next') // Next.js assets are public
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object
  return supabaseResponse
}
