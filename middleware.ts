import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const path = request.nextUrl.pathname;

  // ✔ Public pages
  const PUBLIC = ["/login", "/signup", "/verify-otp"];

  // 1️⃣ Token nahi hai → Login page bhejo
  if (!token) {
    if (!PUBLIC.includes(path)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 2️⃣ Token hai → Verify
  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.set("authToken", "", { maxAge: 0 }); // invalid token delete
    return res;
  }

  const role = payload?.role;

  // 3️⃣ Logged-in user agar login/signup par jaye → Usko panel bhej do
  if (PUBLIC.includes(path)) {
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // 4️⃣ Admin route protection
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // 5️⃣ Student route protection
  if (path.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Sab sahi → Page allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};