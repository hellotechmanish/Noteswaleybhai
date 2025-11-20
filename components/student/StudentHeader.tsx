"use client";

import { Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function StudentHeader({ user }: { user: any }) {
  const getInitials = () => {
    const first = user?.firstName?.charAt(0) || "";
    const last = user?.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || user?.email?.charAt(0).toUpperCase();
  };

  const getFullName = () => {
    if (user?.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.lastName || user?.email;
  };

  return (
    <header className="w-full h-16 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 transition-all">
      {/* LEFT: Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            className="
              w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 
              border-none rounded-lg text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:text-gray-200 dark:placeholder-gray-400
            "
          />
        </div>
      </div>

      {/* RIGHT: Theme + User */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {getFullName()}
            </p>
          </div>

          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
            flex items-center justify-center 
            text-white font-semibold text-sm shadow-md"
          >
            {getInitials()}
          </div>
        </div>
      </div>
    </header>
  );
}
