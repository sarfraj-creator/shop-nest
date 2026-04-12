
import { NextRequest, NextResponse } from "next/server";

/** Routes that require a logged-in user */
const PROTECTED_ROUTES = ["/events"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) return NextResponse.next();

  // Read token from cookie (set at login — see auth.store.ts update below)
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Not logged in → redirect to /login and preserve intended destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists → allow access
  return NextResponse.next();
}

export const config = {
  // Only run middleware on these paths (skip _next, api routes, static files)
  matcher: ["/events/:path*"],
};