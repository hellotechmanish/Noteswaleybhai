// import { cookies } from "next/headers";
// import { verifyToken } from "@/lib/jwt";
// import { redirect } from "next/navigation";
// import { DashboardHeader } from "@/components/student/dashboard-header";
// import { NotesBrowser } from "@/components/student/notes-browser";

// export default async function DashboardPage() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("authToken")?.value;
//   console.log(token);

//   if (!token) {
//     redirect("/login");
//   }

//   const payload = await verifyToken(token);
//   console.log("payload", payload);

//   if (!payload) {
//     redirect("/login");
//   }

//   return (
//     <main className="min-h-screen bg-background">
//       <DashboardHeader userName={`${payload.firstName} ${payload.lastName}`} />

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <NotesBrowser />
//       </div>
//     </main>
//   );
// }

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default async function AdminDashboard() {
  const token = cookies().get("authToken")?.value;
  const payload = await verifyToken(token);

  return <div>Welcome Admin {payload.email}</div>;
}
