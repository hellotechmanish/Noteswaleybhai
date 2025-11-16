"use client";

export interface UserPayload {
  userId: string;
  email: string;
  role: "admin" | "student";
  firstName?: string;
  lastName?: string;
}

export default function StudentHeader({ user }: { user: UserPayload }) {
  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6 border-b">
      <h1 className="text-xl font-semibold">Student Panel</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">
          Welcome 👋 {user.firstName} {user.lastName}
        </span>

        <button className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md">
          Logout
        </button>
      </div>
    </header>
  );
}
