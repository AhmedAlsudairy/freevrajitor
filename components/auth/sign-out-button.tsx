"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./client-auth-provider"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function SignOutButton() {
  const router = useRouter()
  const { t } = useLanguage()
  const { supabase } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)

    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={loading} variant="ghost">
      {loading ? t("auth.signingOut") : t("auth.signOut")}
    </Button>
  )
}
