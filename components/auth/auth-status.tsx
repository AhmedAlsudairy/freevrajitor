"use client"

import { useAuth } from "./client-auth-provider"
import { SignOutButton } from "./sign-out-button"
import { Card, CardContent } from "@/components/ui/card"

export function AuthStatus() {
  const { user, session, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading authentication status...</div>
  }

  return (
    <Card>
      <CardContent className="p-4">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Signed in as:</p>
                <p className="text-lg font-bold">{user.email}</p>
              </div>
              <SignOutButton />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">User ID:</p>
              <p className="text-xs text-gray-500 break-all">{user.id}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium">Session:</p>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium">Not signed in</p>
            <p className="text-sm text-gray-500">Sign in to access your account</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
