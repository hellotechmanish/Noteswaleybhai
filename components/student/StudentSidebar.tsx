"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StudentSidebar() {
  const path = usePathname();

  const linkClass = (href: string) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${
      path === href ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 fixed left-0 top-0">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>

      <nav className="flex flex-col gap-2">
        <Link href="/student" className={linkClass("/student")}>
          Dashboard
        </Link>

        <Link href="/student/upload" className={linkClass("/student/upload")}>
          Upload Notes
        </Link>

        <Link href="/student/notes" className={linkClass("/student/notes")}>
          My Notes
        </Link>

        <Link href="/student/profile" className={linkClass("/student/profile")}>
          Profile
        </Link>
      </nav>
    </aside>
  );
}
