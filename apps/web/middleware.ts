import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthToken, extractTokenFromRequest } from "@/app/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Allow public unauthenticated paths
  const publicPaths = ["/", "/login", "/unauthorized"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. Cryptographically verify JWT token from header or cookie
  const token = extractTokenFromRequest(request);

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyAuthToken(token);
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Protect /admin routes (Admin role ONLY)
  if (pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // 5. Protect /dashboard routes (Employee & Admin roles)
  if (pathname.startsWith("/dashboard")) {
    if (user.role !== "employee" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/unauthorized"],
};

