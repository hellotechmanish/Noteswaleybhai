import StudentHeader from "@/components/student/StudentHeader";
import StudentSidebar from "@/components/student/StudentSidebar";
import { getTokenPayload } from "@/lib/getTokenPayload";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getTokenPayload();

  if (!payload || payload.role !== "student") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* FIXED SIDEBAR */}
      <StudentSidebar />

      {/* Main content area with padding-left equal to sidebar width */}
      <div className="flex-1 flex flex-col ml-20 md:ml-64 transition-all">
        <StudentHeader user={payload} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
