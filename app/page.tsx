'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1]

    setIsLoggedIn(!!token)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold">Student Notes</span>
        </div>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                    router.push('/')
                  })
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-balance">
          Quality Notes from Your Peers
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
          Access university-verified notes from experienced students. Learn smarter, not harder.
        </p>
        {!isLoggedIn && (
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg border">
            <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Quality Notes</h3>
            <p className="text-muted-foreground">
              Access comprehensive, verified notes from verified students across universities.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Earn While Sharing</h3>
            <p className="text-muted-foreground">
              Upload your notes and earn money when other students access them.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border">
            <Award className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Expert Verified</h3>
            <p className="text-muted-foreground">
              All notes are verified by admin before being available to students.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-blue-600 text-white rounded-lg mb-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Exams?</h2>
          <p className="mb-6 text-blue-100 text-lg">
            Join thousands of students already using Student Notes
          </p>
          {!isLoggedIn && (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Start Learning Today</Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  )
}
