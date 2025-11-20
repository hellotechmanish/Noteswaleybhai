"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Upload,
  FileText,
  User,
  CreditCard,
  Settings,
  ChevronLeft,
  LogOut,
  BookOpen,
} from "lucide-react";

export default function StudentSidebar({
  isExpanded,
  isPinned,
  setIsExpanded,
  setIsPinned,
}: {
  isExpanded: boolean;
  isPinned: boolean;
  setIsExpanded: (v: boolean) => void;
  setIsPinned: (v: boolean) => void;
}) {
  const path = usePathname();

  const menuItems = [
    { href: "/student", icon: Home, label: "Dashboard" },
    { href: "/student/upload", icon: Upload, label: "Upload Notes" },
    { href: "/student/notes", icon: FileText, label: "My Notes" },
    { href: "/student/profile", icon: User, label: "Profile" },
    { href: "/student/earnings", icon: CreditCard, label: "Earnings" },
    { href: "/student/settings", icon: Settings, label: "Settings" },
  ];

  const handleMouseEnter = () => {
    if (!isPinned) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) setIsExpanded(false);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) setIsExpanded(true);
  };

  const isActive = (href: string) => path === href;

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        fixed left-0 top-0 h-screen z-50 
        bg-gradient-to-b from-gray-50 to-gray-200
        dark:from-gray-900 dark:to-gray-800
        shadow-xl border-r border-gray-300 dark:border-gray-700
        transition-all duration-300
        ${isExpanded || isPinned ? "w-64" : "w-20"}
      `}
    >
      {/* TOP BRAND */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>

          <span
            className={`text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap transition-all duration-300 overflow-hidden
              ${isExpanded || isPinned ? "opacity-100 w-auto" : "opacity-0 w-0"}
            `}
          >
            NotesWaleyBhai
          </span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg transition-all duration-200
                  ${
                    active
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {/* ICON BOX */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all
                    ${
                      active
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* LABEL */}
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-all overflow-hidden
                    ${
                      isExpanded || isPinned
                        ? "opacity-100 w-auto"
                        : "opacity-0 w-0"
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>

              {/* TOOLTIP */}
              {!isExpanded && !isPinned && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2
                  bg-gray-900 text-white rounded-md px-3 py-1 text-sm 
                  opacity-0 group-hover:opacity-100 transition shadow-lg whitespace-nowrap"
                >
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700 space-y-2">
        {/* PIN TOGGLE */}
        <button
          onClick={togglePin}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all
            ${
              isPinned
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }
          `}
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${
              isPinned ? "rotate-180" : ""
            }`}
          />

          <span
            className={`text-sm whitespace-nowrap transition-all ${
              isExpanded || isPinned ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            {isPinned ? "Unpin" : "Pin"}
          </span>
        </button>

        {/* LOGOUT */}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg 
              hover:bg-red-600 dark:hover:bg-red-700 hover:text-white
              text-gray-700 dark:text-gray-300 transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>

            <span
              className={`text-sm transition-all ${
                isExpanded || isPinned ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Logout
            </span>
          </button>
        </form>
      </div>
    </aside>
  );
}
