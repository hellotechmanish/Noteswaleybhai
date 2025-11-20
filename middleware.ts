import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const path = request.nextUrl.pathname;

  // Public pages allowed WITHOUT token
  const PUBLIC = ["/", "/login", "/signup"];
  const isPublic = PUBLIC.includes(path);

  // --------------------------
  // 1️⃣ No token → Only PUBLIC pages allowed
  // --------------------------
  if (!token) {
    if (!isPublic) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // --------------------------
  // 2️⃣ Token HAI → JWT Verify
  // --------------------------
  let payload: any;
  try {
    payload = await verifyToken(token);
  } catch {
    const res = NextResponse.redirect(new URL("/", request.url));
    res.cookies.set("authToken", "", { maxAge: 0 });
    return res;
  }

  const role = payload?.role;

  // --------------------------
  // 3️⃣ Token user visiting / or /login or /signup → redirect to dashboard
  // --------------------------
  if (isPublic) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/student", request.url)
    );
  }

  // --------------------------
  // 4️⃣ Admin protection
  // --------------------------
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  // --------------------------
  // 5️⃣ Student protection
  // --------------------------
  if (path.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
