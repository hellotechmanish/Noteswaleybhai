import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Student Notes</h1>
          <p className="text-muted-foreground">Access quality study materials</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
