import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, ArrowRight } from "lucide-react";
import { getTokenPayload } from "@/lib/getTokenPayload";
import ThemeToggle from "@/components/ThemeToggle";

export default async function HomePage() {
  const payload = await getTokenPayload();
  const isLoggedIn = !!payload;

  async function handleLogout() {
    "use server";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            NotesWaleyBhai
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isLoggedIn ? (
            <>
              {payload.role === "admin" ? (
                <Button variant="outline" asChild>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href="/student">Dashboard</Link>
                </Button>
              )}
              <form action={handleLogout}>
                <Button type="submit">Logout</Button>
              </form>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-balance text-gray-900 dark:text-white">
          Quality Notes from Your Peers
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-balance max-w-2xl mx-auto">
          Access university-verified notes from experienced students. Learn
          smarter, not harder.
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
        {isLoggedIn && (
          <Button size="lg" asChild>
            <Link
              href={payload.role === "admin" ? "/admin/dashboard" : "/student"}
            >
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors hover:shadow-lg dark:hover:shadow-blue-500/10">
            <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Quality Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access comprehensive, verified notes from verified students across
              universities.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors hover:shadow-lg dark:hover:shadow-blue-500/10">
            <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Earn While Sharing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your notes and earn money when other students access them.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors hover:shadow-lg dark:hover:shadow-blue-500/10">
            <Award className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Expert Verified
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All notes are verified by admin before being available to
              students.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-lg mb-20 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Exams?</h2>
          <p className="mb-6 text-blue-100 dark:text-blue-200 text-lg">
            Join thousands of students already using NotesWaleyBhai
          </p>
          {!isLoggedIn && (
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link href="/signup">Start Learning Today</Link>
            </Button>
          )}
          {isLoggedIn && (
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link
                href={
                  payload.role === "admin" ? "/admin/dashboard" : "/student"
                }
              >
                Continue to Dashboard
              </Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
