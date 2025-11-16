import { getTokenPayload } from "@/lib/getTokenPayload";

export default async function AdminDashboard() {
  const user = await getTokenPayload();

  if (!user) {
    return <div>Not authorized</div>;
  }

  return <div>Welcome Admin {user.firstName}</div>;
}
