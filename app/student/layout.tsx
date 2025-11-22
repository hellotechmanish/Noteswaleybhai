"use client";

import { useState } from "react";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentHeader from "../../components/student/StudentHeader";
export default function StudentLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-all">
      {/* Sidebar */}
      <StudentSidebar
        isExpanded={isExpanded}
        isPinned={isPinned}
        setIsExpanded={setIsExpanded}
        setIsPinned={setIsPinned}
      />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          ${isExpanded || isPinned ? "ml-64" : "ml-20"}
        `}
      >
        {/* Header */}
        <StudentHeader user={user} />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
