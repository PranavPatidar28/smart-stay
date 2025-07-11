import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isProtectedPage = req.nextUrl.pathname.startsWith("/owner-dashboard") || 
                           req.nextUrl.pathname.startsWith("/favorites") ||
                           req.nextUrl.pathname.startsWith("/profile");
    const isRoleSelectionPage = req.nextUrl.pathname === "/auth/select-role";

    // If user is on an auth page and is already authenticated, redirect to home
    if (isAuthPage && isAuth && !isRoleSelectionPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If user is authenticated but doesn't have a role, redirect to role selection
    if (isAuth && !token?.role && !isRoleSelectionPage && !isAuthPage) {
      return NextResponse.redirect(new URL("/auth/select-role", req.url));
    }

    // If user has a role and tries to access role selection page, redirect to home
    if (isAuth && token?.role && isRoleSelectionPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect dashboard routes for landlords only
    if (req.nextUrl.pathname.startsWith("/owner-dashboard")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
      if (token?.role !== "LANDLORD") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Protect other authenticated routes
    if (isProtectedPage && !isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without authentication
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true;
        }
        // For other protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/auth/:path*",
    "/owner-dashboard/:path*",
    "/favorites/:path*",
    "/profile/:path*",
    "/settings/:path*",
    // "/" is removed so home page is public
    // "/listings" is not included, so it remains public
  ],
}; 