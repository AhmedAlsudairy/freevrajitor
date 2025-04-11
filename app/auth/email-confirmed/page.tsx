"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function EmailConfirmedPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{t("auth.emailConfirmed.title")}</CardTitle>
          <CardDescription className="text-center">{t("auth.emailConfirmed.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 pb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <p className="text-center text-lg font-medium">{t("auth.emailConfirmed.welcomeBack")}</p>
          <p className="text-center">{t("auth.emailConfirmed.readyToSignIn")}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/sign-in")} className="w-full">
            {t("auth.emailConfirmed.signIn")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
