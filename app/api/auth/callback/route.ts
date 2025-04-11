import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const searchParams = requestUrl.searchParams

    console.log("Auth callback received, code exists:", !!code)

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${requestUrl.origin}/sign-in?error=${encodeURIComponent(error.message)}`)
      }
    }

    let redirectTo: string
    if (searchParams.has("next")) {
      redirectTo = searchParams.get("next") as string
    } else if (searchParams.has("type") && searchParams.get("type") === "email_confirmation") {
      // If this is an email confirmation, redirect to the confirmation success page
      redirectTo = "/auth/confirmation-success"
    } else {
      // Default redirect
      redirectTo = "/"
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL("/sign-in?error=Unknown+error", request.url))
  }
}
