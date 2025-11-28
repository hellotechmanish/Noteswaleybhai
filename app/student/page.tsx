"use client";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  FileText,
  Target,
} from "lucide-react";

export interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export default function StudentHome() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/student/todo");
        const data = await res.json();
        setTodos(data.todos || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const upcomingTodos = todos
    .filter((todo) => new Date(todo.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const urgentTodos = todos.filter((todo) => todo.category === "Urgent");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-300 dark:from-blue-800 dark:to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {getGreeting()}, Student! 👋
              </h1>
              <p className="text-blue-100 dark:text-blue-200 text-lg">
                Ready to make today productive?
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/30">
              <div className="text-sm text-blue-100 mb-1">Today's Date</div>
              <div className="text-xl font-bold">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                5
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">
              Active Courses
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Enrolled this semester
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {todos.length}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">
              Total Tasks
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              In your todo list
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle
                  className="text-red-600 dark:text-red-400"
                  size={24}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {urgentTodos.length}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">
              Urgent Tasks
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Need immediate attention
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                85%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">
              Progress
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Overall completion
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Upcoming Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                  Upcoming Tasks
                </h2>
                <a
                  href="/student/todo"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View All
                </a>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : upcomingTodos.length === 0 ? (
                <div className="text-center py-12">
                  <Target
                    className="mx-auto text-gray-400 dark:text-gray-600 mb-3"
                    size={48}
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    No upcoming tasks
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    You're all caught up! 🎉
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTodos.map((todo) => (
                    <div
                      key={todo._id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          todo.category === "Urgent"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-green-100 dark:bg-green-900/30"
                        }`}
                      >
                        <FileText
                          className={
                            todo.category === "Urgent"
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }
                          size={20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {todo.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {todo.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(todo.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${
                              todo.category === "Urgent"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            }`}
                          >
                            {todo.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Completed Tasks
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    12
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Study Hours
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    24h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Assignments Due
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    3
                  </span>
                </div>
              </div>
            </div>

            {/* Motivation Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-2">💡 Daily Tip</h3>
              <p className="text-sm text-blue-50">
                Break your study sessions into 25-minute focused blocks with
                5-minute breaks. This technique helps maintain concentration!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2025 Student Portal. Keep learning, keep growing! 🚀
          </p>
        </div>
      </footer>
    </div>
  );
}
