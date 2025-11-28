"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Upload,
  FileText,
  User,
  ChevronLeft,
  LogOut,
  BookOpen,
  ChevronDown,
  AirVent,
  Sparkles,
} from "lucide-react";

type NavItem = {
  href?: string;
  icon: any;
  label: string;
  children?: { href: string; icon: any; label: string }[];
};

// ✅ Easy to customize menu structure
const menuItems: NavItem[] = [
  { href: "/student", icon: Home, label: "Dashboard" },
  {
    icon: FileText,
    label: "My Notes",
    children: [
      { href: "/student/upload", icon: Upload, label: "Upload Notes" },
      { href: "/student/notes", icon: FileText, label: "All Notes" },
    ],
  },
  { href: "/student/todo", icon: User, label: "Todo" },
  { href: "/student/ai", icon: Sparkles, label: "AI" },
  { href: "/student/profile", icon: User, label: "Profile" },
];

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
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [submenuHeight, setSubmenuHeight] = useState<Record<number, number>>(
    {}
  );
  const submenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback((href: string) => path === href, [path]);

  // ✅ Auto open submenu if child route is active
  useEffect(() => {
    menuItems.forEach((item, index) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (isActive(child.href)) {
            setOpenSubmenu(index);
          }
        });
      }
    });
  }, [path, isActive]);

  // ✅ Set dynamic height for submenu animation
  useEffect(() => {
    if (openSubmenu !== null) {
      const el = submenuRefs.current[openSubmenu];
      if (el) {
        setSubmenuHeight((prev) => ({
          ...prev,
          [openSubmenu]: el.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  // ✅ Close submenu when sidebar collapses
  useEffect(() => {
    if (!isExpanded && !isPinned) {
      setOpenSubmenu(null);
    }
  }, [isExpanded, isPinned]);

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

  const toggleSubmenu = (index: number) => {
    if (isExpanded || isPinned) {
      setOpenSubmenu((prev) => (prev === index ? null : index));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        fixed left-0 top-0 h-screen z-50 
        bg-gradient-to-b from-gray-50 to-gray-100
        dark:from-gray-900 dark:to-gray-800
        shadow-xl border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${isExpanded || isPinned ? "w-64" : "w-20"}
      `}
    >
      {/* TOP BRAND */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
      <nav className="flex-1  p-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          // ✅ NORMAL MENU ITEM (without children)
          if (!item.children) {
            const active = isActive(item.href!);

            return (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 px-3 py-2.5
                    ${
                      active
                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />

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

                {/* TOOLTIP for collapsed state */}
                {!isExpanded && !isPinned && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2
                    bg-gray-900 dark:bg-gray-700 text-white rounded-md px-3 py-1 text-sm 
                    opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap pointer-events-none z-50"
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          }

          // ✅ SUBMENU PARENT
          const hasActiveChild = item.children.some((child) =>
            isActive(child.href)
          );

          return (
            <div key={item.label}>
              <button
                onClick={() => toggleSubmenu(index)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200
                  ${
                    hasActiveChild || openSubmenu === index
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-5 h-5 flex-shrink-0" />
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
                </div>

                <ChevronDown
                  className={`w-4 h-4 transition-all duration-300 flex-shrink-0 ${
                    openSubmenu === index ? "rotate-180" : ""
                  } ${isExpanded || isPinned ? "opacity-100" : "opacity-0"}`}
                />
              </button>

              {/* ✅ ANIMATED SUBMENU */}
              <div
                ref={(el) => {
                  submenuRefs.current[index] = el;
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  height:
                    openSubmenu === index && (isExpanded || isPinned)
                      ? `${submenuHeight[index]}px`
                      : "0px",
                }}
              >
                <div className="ml-3 mt-1 space-y-1 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = isActive(child.href);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                          ${
                            childActive
                              ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                          }
                        `}
                      >
                        <ChildIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium whitespace-nowrap">
                          {child.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
        {/* PIN TOGGLE */}
        <button
          onClick={togglePin}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all
            ${
              isPinned
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }
          `}
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform flex-shrink-0 ${
              isPinned ? "rotate-180" : ""
            }`}
          />

          <span
            className={`text-sm font-medium whitespace-nowrap transition-all overflow-hidden ${
              isExpanded || isPinned ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            {isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
          </span>
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg 
            hover:bg-red-600 dark:hover:bg-red-700 hover:text-white
            text-gray-700 dark:text-gray-300 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />

          <span
            className={`text-sm font-medium whitespace-nowrap transition-all overflow-hidden ${
              isExpanded || isPinned ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
