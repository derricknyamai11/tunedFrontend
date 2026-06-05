import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/client/:path*",
    "/admin/:path*",
    "/writer/:path*",
    "/auth/login",
    "/auth/register",
  ],
};

function sanitizeProxyPath(path: string): string {
  return path.replace(/[^\w/.\-%~]/g, "");
}

const SESSION_COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "tuned_session";
const JWT_COOKIE_NAME =
  process.env.NEXT_PUBLIC_JWT_COOKIE_NAME ?? "tuned_access_token";

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/client") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/writer")
  );
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Accept either the Flask session cookie or the JWT cookie as proof of auth.
  // Both are HttpOnly — checking for presence (not value) is sufficient here.
  // The actual role/validity check happens server-side in each layout.
  const hasSession =
    request.cookies.has(SESSION_COOKIE_NAME) ||
    request.cookies.has(JWT_COOKIE_NAME);

  if (isProtectedRoute(pathname) && !hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    const safePath = sanitizeProxyPath(pathname);
    loginUrl.searchParams.set("callbackUrl", safePath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}