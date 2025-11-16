import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const path = request.nextUrl.pathname;

  // Public pages
  const PUBLIC = ["/login", "/signup", "/verify-otp"];

  // --------------------------
  // 1️⃣ Token NAHI hai → Login bhejo
  // --------------------------
  if (!token) {
    if (!PUBLIC.includes(path)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // --------------------------
  // 2️⃣ Token HAI → JWT Verify
  // --------------------------
  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.set("authToken", "", { maxAge: 0 });
    return res;
  }

  const isverify = payload?.isverify;
  const role = payload?.role;

  // --------------------------
  // 3️⃣ USER IS NOT VERIFIED → Force to /verify-otp
  // --------------------------
  if (!isverify) {
    // Only allow verify-otp page
    if (!path.startsWith("/verify-otp")) {
      return NextResponse.redirect(
        new URL(`/verify-otp?email=${payload?.email}`, request.url)
      );
    }
    return NextResponse.next();
  }

  // --------------------------
  // 4️⃣ Verified user visiting login/signup → redirect
  // --------------------------
  if (PUBLIC.includes(path)) {
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // --------------------------
  // 5️⃣ Admin protection
  // --------------------------
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // --------------------------
  // 6️⃣ Student protection
  // --------------------------
  if (path.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // --------------------------
  // Everything OK
  // --------------------------
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
