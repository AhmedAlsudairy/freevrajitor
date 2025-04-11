import AuthForm from "@/components/auth/auth-form"

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold mb-8">Create an Account</h1>
        <AuthForm />
      </div>
    </div>
  )
}
