"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Upload,
  FileText,
  User,
  ChevronLeft,
  BookOpen,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function StudentSidebar() {
  const path = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const menuItems = [
    { href: "/student", icon: Home, label: "Dashboard" },
    { href: "/student/upload", icon: Upload, label: "Upload Notes" },
    { href: "/student/notes", icon: FileText, label: "My Notes" },
    { href: "/student/profile", icon: User, label: "Profile" },
    { href: "/student/earnings", icon: CreditCard, label: "Earnings" },
    { href: "/student/settings", icon: Settings, label: "Settings" },
  ];

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const handleMenuClick = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const isActive = (href: string) => path === href;

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white-900 to-whit-800 dark:from-gray-900 dark:to-gray-900 text-white shadow-2xl transition-all duration-300 ease-in-out z-50 ${
        isExpanded || isPinned ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-colors flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded || isPinned ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            <h1 className="text-xl font-bold whitespace-nowrap">
              NotesWaleyBhai
            </h1>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <div key={item.href} className="relative">
              <Link
                href={item.href}
                onClick={handleMenuClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
                    : "text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isExpanded || isPinned
                      ? "opacity-100 w-auto"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
              {/* Tooltip for collapsed state */}
              {!isExpanded && !isPinned && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-950 text-white px-3 py-2 rounded-md text-sm opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-50 border border-gray-700 dark:border-gray-800">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="border-t border-gray-700 dark:border-gray-800 p-4 space-y-2">
        {/* Pin/Unpin Button */}
        <button
          onClick={togglePin}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isPinned
              ? "bg-blue-600 dark:bg-blue-500 text-white"
              : "text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white"
          }`}
        >
          <ChevronLeft
            className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
              isPinned ? "rotate-180" : ""
            }`}
          />
          <span
            className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              isExpanded || isPinned
                ? "opacity-100 w-auto"
                : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            {isPinned ? "Unpin" : "Pin"}
          </span>
        </button>

        {/* Logout */}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 dark:text-gray-400 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isExpanded || isPinned
                  ? "opacity-100 w-auto"
                  : "opacity-0 w-0 overflow-hidden"
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
