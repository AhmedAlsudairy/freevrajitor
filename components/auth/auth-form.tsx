"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"
import { useLanguage } from "@/contexts/language-context"

export default function AuthForm() {
  const { t } = useLanguage()

  return (
    <Tabs defaultValue="signin" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
        <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <SignInForm />
      </TabsContent>

      <TabsContent value="signup">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  )
}
