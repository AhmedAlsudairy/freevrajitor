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
import { AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function SignInForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const { supabase } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebug("Starting sign in process...")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setDebug(
        (prev) => `${prev}\nSign in response: ${JSON.stringify(data || {})}\nError: ${JSON.stringify(error || {})}`,
      )

      if (error) throw error

      setDebug((prev) => `${prev}\nSign in successful, redirecting...`)
      // Force hard navigation to ensure full page reload and proper state refresh
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(error.message || "An error occurred during sign in")
      setDebug((prev) => `${prev}\nError caught: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("auth.signIn")}</CardTitle>
        <CardDescription>{t("auth.signInDesc")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignIn}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("auth.signingIn") : t("auth.signIn")}
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
