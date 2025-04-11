"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Extract parameters
    const code = searchParams.get("code")
    const type = searchParams.get("type")
    const next = searchParams.get("next") || "/"

    if (code && type === "email_confirmation") {
      // Redirect to confirm page with the code
      router.push(`/auth/confirm?code=${code}&type=${type}`)
    } else if (code) {
      // Redirect to callback to let the route handler process it
      router.push(`/auth/callback?code=${code}&next=${next}`)
    } else {
      // No code, redirect to home
      router.push("/")
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg">Processing authentication...</p>
    </div>
  )
}
