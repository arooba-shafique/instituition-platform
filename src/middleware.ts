import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/api/auth")) {
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL(getRedirectPath(token.role as string), request.url));
    }
    return NextResponse.next();
  }

  // Protected routes require auth
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access
  const role = token.role as string;
  if (pathname.startsWith("/admin") && role !== "admin" && role !== "admin_manager") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/parent") && role !== "parent") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

function getRedirectPath(role: string): string {
  switch (role) {
    case "admin":
    case "admin_manager":
      return "/admin";
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    case "parent":
      return "/parent";
    default:
      return "/login";
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
