import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");
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