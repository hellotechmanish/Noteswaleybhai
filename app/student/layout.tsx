import { getTokenPayload } from "@/lib/getTokenPayload";
import StudentHeader from "@/components/student/StudentHeader";
import StudentSidebar from "@/components/student/StudentSidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getTokenPayload();
  console.log("user", user);

  return (
    <div className="flex">
      <StudentSidebar />

      <div className="flex-1">
        <StudentHeader user={user as any} />
        <main>{children}</main>
      </div>
    </div>
  );
}
