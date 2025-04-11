"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // The server-side route handler will automatically process the code and redirect
    // This page is just a loading screen while that happens
    
    // If for some reason we end up here without a code, redirect to home
    if (!searchParams.get("code")) {
      router.push("/")
    }
    // The route.ts file will handle the actual code exchange
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg">Processing authentication...</p>
    </div>
  )
}
