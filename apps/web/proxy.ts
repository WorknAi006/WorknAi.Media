import { NextResponse, type NextRequest } from "next/server";
import { verifyAuthToken, extractTokenFromRequest } from "@/app/lib/auth";

// Host-based routing (production only; unset in local dev):
//   MAIN_HOST  = worknai.media        -> public site + employee dashboard
//   ADMIN_HOST = admin.worknai.media  -> admin panel
const MAIN_HOST = process.env.MAIN_HOST || "";
const ADMIN_HOST = process.env.ADMIN_HOST || "";

function requestHost(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  return host.split(":")[0].toLowerCase();
}

// Builds an absolute URL that respects the public scheme/host set by nginx
function publicUrl(request: NextRequest, pathname: string, host?: string): URL {
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
  return new URL(pathname, `${proto}://${host || request.headers.get("host") || request.nextUrl.host}`);
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = publicUrl(request, "/login");
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = requestHost(request);

  // 1. Subdomain routing
  if (ADMIN_HOST && MAIN_HOST) {
    const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
    const isSharedPath = pathname === "/login" || pathname === "/unauthorized";

    if (host === ADMIN_HOST) {
      if (pathname === "/") {
        return NextResponse.redirect(publicUrl(request, "/admin"));
      }
      if (!isAdminPath && !isSharedPath) {
        return NextResponse.redirect(publicUrl(request, pathname + search, MAIN_HOST));
      }
    } else if (host === MAIN_HOST && isAdminPath) {
      return NextResponse.redirect(publicUrl(request, pathname + search, ADMIN_HOST));
    }
  }

  // 2. Allow public unauthenticated paths
  const publicPaths = ["/", "/login", "/unauthorized"];
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  if (publicPaths.includes(pathname) || !isProtected) {
    return NextResponse.next();
  }

  // 3. Cryptographically verify JWT token from header or cookie
  const token = extractTokenFromRequest(request);
  if (!token) {
    return redirectToLogin(request, pathname);
  }

  const user = await verifyAuthToken(token);
  if (!user) {
    return redirectToLogin(request, pathname);
  }

  // 4. Protect /admin routes (Admin role ONLY)
  if (pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      return NextResponse.redirect(publicUrl(request, "/unauthorized"));
    }
  }

  // 5. Protect /dashboard routes (Employee & Admin roles)
  if (pathname.startsWith("/dashboard")) {
    if (user.role !== "employee" && user.role !== "admin") {
      return NextResponse.redirect(publicUrl(request, "/unauthorized"));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes, Next internals and static files (anything with an extension)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
