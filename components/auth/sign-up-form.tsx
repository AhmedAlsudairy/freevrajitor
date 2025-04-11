"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./client-auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Briefcase, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function SignUpForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const { supabase } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountType, setAccountType] = useState<"client" | "freelancer" | "both">("client")
  const [debug, setDebug] = useState<string | null>(null)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebug("Starting sign up process...")

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            username,
          },
        },
      })

      setDebug(
        (prev) =>
          `${prev}\nSign up response: ${JSON.stringify(data || {})}\nError: ${JSON.stringify(signUpError || {})}`,
      )

      if (signUpError) throw signUpError

      if (data.user) {
        setDebug((prev) => `${prev}\nUser created, ID: ${data.user?.id}`)

        // Skip immediate sign-in since email confirmation is required
        setDebug((prev) => `${prev}\nSkipping immediate sign-in due to email confirmation requirement`)

        // Create profile using server-side API with admin privileges
        const response = await fetch("/api/auth/create-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.user.id,
            username,
            fullName,
            email,
            isFreelancer: accountType === "freelancer" || accountType === "both",
            isClient: accountType === "client" || accountType === "both",
          }),
        })

        const result = await response.json()
        setDebug((prev) => `${prev}\nServer-side profile creation: ${JSON.stringify(result)}`)

        if (!response.ok) {
          throw new Error(result.error || "Failed to create profile via server")
        }

        // Create freelancer profile if needed
        if (accountType === "freelancer" || accountType === "both") {
          const freelancerResponse = await fetch("/api/auth/create-freelancer-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: data.user.id,
            }),
          })

          const freelancerResult = await freelancerResponse.json()
          setDebug((prev) => `${prev}\nServer-side freelancer profile creation: ${JSON.stringify(freelancerResult)}`)

          if (!freelancerResponse.ok) {
            throw new Error(freelancerResult.error || "Failed to create freelancer profile")
          }
        }

        // Create client profile if needed
        if (accountType === "client" || accountType === "both") {
          const clientResponse = await fetch("/api/auth/create-client-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: data.user.id,
            }),
          })

          const clientResult = await clientResponse.json()
          setDebug((prev) => `${prev}\nServer-side client profile creation: ${JSON.stringify(clientResult)}`)

          if (!clientResponse.ok) {
            throw new Error(clientResult.error || "Failed to create client profile")
          }
        }

        setDebug((prev) => `${prev}\nRegistration complete, email confirmation required`)
        setRegistrationComplete(true)
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      setError(error.message || "An error occurred during sign up")
      setDebug((prev) => `${prev}\nError caught: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (registrationComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.confirmEmail")}</CardTitle>
          <CardDescription>{t("auth.confirmEmailDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium">{t("auth.checkYourEmail")}</h3>
            <p className="text-sm text-gray-500 mt-2">
              {t("auth.emailSentTo")} <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-4">{t("auth.clickLinkToConfirm")}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/sign-in")}>
            {t("auth.backToSignIn")}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("auth.signUp")}</CardTitle>
        <CardDescription>{t("auth.signUpDesc")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignUp}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("auth.fullName")}</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">{t("auth.username")}</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signupEmail">{t("auth.email")}</Label>
            <Input
              id="signupEmail"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signupPassword">{t("auth.password")}</Label>
            <Input
              id="signupPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-4">
            <Label>{t("auth.accountType")}</Label>
            <RadioGroup 
              value={accountType} 
              onValueChange={(value) => setAccountType(value as "client" | "freelancer" | "both")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="flex flex-1 cursor-pointer items-center space-x-3 font-normal">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <div>{t("auth.client")}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("auth.clientDesc") || "Post jobs and hire talented freelancers for your projects"}
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer" className="flex flex-1 cursor-pointer items-center space-x-3 font-normal">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="space-y-1">
                    <div>{t("auth.freelancer")}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("auth.freelancerDesc") || "Offer your services and get hired for projects"}
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="flex flex-1 cursor-pointer items-center space-x-3 font-normal">
                  <div className="flex">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <Users className="h-5 w-5 text-primary ml-1" />
                  </div>
                  <div className="space-y-1">
                    <div>{t("auth.both") || "Both"}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("auth.bothDesc") || "Access both client and freelancer features"}
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("auth.signingUp") : t("auth.signUp")}
          </Button>

          {/* Debug information - remove in production */}
          {debug && (
            <div className="w-full mt-4 p-2 bg-gray-100 text-xs text-gray-800 rounded overflow-auto max-h-40">
              <pre>{debug}</pre>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
