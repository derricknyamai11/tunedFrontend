import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/client/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};

function sanitizeProxyPath(path: string): string {
  return path.replace(/[^\w/.\-%~]/g, "");
}

const SESSION_COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "tuned_session";

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/client") ||
    pathname.startsWith("/admin")
  );
}

function isAuthRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")
  );
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (isProtectedRoute(pathname) && !hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    const safePath = sanitizeProxyPath(pathname);
    loginUrl.searchParams.set("callbackUrl", safePath);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute(pathname) && hasSession) {
    const dashboard = new URL(
      process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL ?? "/client/dashboard",
      request.url,
    );
    return NextResponse.redirect(dashboard);
  }

  return NextResponse.next();
}