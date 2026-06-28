import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // Use Better Auth's helper instead of a hardcoded cookie name. Over HTTPS
  // (production) Better Auth prefixes the cookie with "__Secure-", so a literal
  // "better-auth.session_token" lookup is always undefined in prod — which made
  // every protected route bounce to sign-in (and then back home). getSessionCookie
  // checks both "__Secure-<name>" and "<name>".
  const sessionCookie = getSessionCookie(request);
  const isAuth = !!sessionCookie;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");
  const isRoleSelectionPage = pathname === "/auth/select-role";
  const isProtectedPage =
    pathname.startsWith("/owner-dashboard") ||
    pathname.startsWith("/favorites") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  // If user is on an auth page and is already authenticated, redirect to home
  // Exception: allow access to role selection page
  if (isAuthPage && isAuth && !isRoleSelectionPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to sign-in for protected pages
  if (isProtectedPage && !isAuth) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/owner-dashboard/:path*",
    "/favorites/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};