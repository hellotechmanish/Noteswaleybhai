import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Student Notes</h1>
          <p className="text-muted-foreground">Join the learning community</p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}
