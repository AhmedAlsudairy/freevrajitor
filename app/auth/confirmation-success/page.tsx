"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/ui/use-toast"

export default function ConfirmationSuccessPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    // Show a toast notification when the page loads
    toast({
      title: t("auth.emailConfirmed.title") || "Email Confirmed!",
      description: t("auth.emailConfirmed.description") || "Your email has been successfully verified.",
      variant: "success",
    })
  }, [toast, t])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{t("auth.emailConfirmed.title") || "Email Confirmed!"}</CardTitle>
          <CardDescription className="text-center">
            {t("auth.emailConfirmed.description") || "Your email has been successfully verified."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 pb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <p className="text-center text-lg font-medium">
            {t("auth.emailConfirmed.welcomeBack") || "Welcome to our platform!"}
          </p>
          <p className="text-center">
            {t("auth.emailConfirmed.readyToSignIn") || "You can now sign in with your verified email."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={() => router.push("/sign-in")} className="w-full">
            {t("auth.emailConfirmed.signIn") || "Sign In"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="w-full">
            {t("auth.emailConfirmed.goHome") || "Go to Home Page"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
