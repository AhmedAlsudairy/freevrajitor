import { AuthStatus } from "@/components/auth/auth-status"
import AuthForm from "@/components/auth/auth-form"

export default function AuthTestPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Auth Test Page</h1>
        <p className="text-gray-500 mt-2">Test your Supabase authentication</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Auth Status:</h2>
        <AuthStatus />
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Variables:</h2>
        <div className="space-y-2">
          <p>NEXT_PUBLIC_SUPABASE_URL available: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌"}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY available: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌"}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <AuthForm />
      </div>
    </div>
  )
}
