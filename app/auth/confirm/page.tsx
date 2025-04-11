"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  useEffect(() => {
    const confirmToken = async () => {
      try {
        console.log("Starting email confirmation process...")

        // Get token from URL - could be named token, code, or token_hash
        const token = searchParams.get("token") || searchParams.get("code") || searchParams.get("token_hash")
        const type = searchParams.get("type")

        console.log("Token:", token ? "Present" : "Missing")
        console.log("Type:", type)
        console.log("Raw token value:", token)

        if (!token) {
          console.error("Missing token parameter")
          setStatus("error")
          setErrorMessage("Missing confirmation token")
          return
        }

        // Try to verify the token
        console.log("Verifying token...")
        const supabase = createClientComponentClient()
        
        // For token_hash, we use it directly
        // For verifyOtp, the parameter name should match the actual token format
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup", // Valid OTP type values are: 'signup', 'recovery', 'email'
        })

        if (error) {
          console.error("Verification error:", error)
          setStatus("error")
          setErrorMessage(error.message || "Failed to verify email")
          return
        }

        console.log("Email confirmed successfully!")
        setStatus("success")

        // Redirect to home page with email_verified flag after a short delay
        setTimeout(() => {
          router.push("/?email_verified=true")
        }, 2000)
      } catch (error) {
        console.error("Confirmation error:", error)
        setStatus("error")
        setErrorMessage("An unexpected error occurred")
      }
    }

    confirmToken()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === "loading" && t("auth.confirmation.verifying")}
            {status === "success" && t("auth.confirmation.success")}
            {status === "error" && t("auth.confirmation.failed")}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && t("auth.confirmation.verifyingDescription")}
            {status === "success" && t("auth.confirmation.successDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
          {status === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
          {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
        </CardContent>
        {status !== "loading" && (
          <CardFooter className="flex flex-col gap-4">
            {status === "error" && <p className="text-center text-red-500">{errorMessage}</p>}
            {status === "success" && <p className="text-center">{t("auth.confirmation.successDescription")}</p>}
            <Button onClick={() => router.push(status === "success" ? "/sign-in" : "/")} className="w-full">
              {status === "success" ? t("auth.confirmation.signIn") : t("auth.confirmation.goHome")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
