export default function StudentHome() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-8 transition-colors duration-300">
      {/* Header */}
      <header className="w-full bg-blue-600 dark:bg-blue-800 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Welcome back, Student 👋
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Here’s a quick overview of your learning progress and upcoming
            tasks.
          </p>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                📚 Courses
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You’re enrolled in 5 courses.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-green-700 dark:text-green-300">
                ✅ Assignments
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                2 assignments due this week.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">
                📅 Schedule
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Next class: Friday, 10 AM.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-500 dark:text-gray-400 text-sm mt-6">
        © 2025 Student Portal
      </footer>
    </div>
  );
}
