import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected routes by role
const protectedRoutes = {
  student: ["/student"],
  faculty: ["/faculty"],
  coordinator: ["/coordinator"],
  admin: ["/admin"],
  guest: ["/guest"],
  authenticated: ["/thankyou"],
};

// Routes that anyone can access without authentication
const publicRoutes = ["/", "/team", "/favicon.ico"];

// API routes that don't require authentication check
const publicApiRoutes = ["/api/auth", "/api/seed"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    return NextResponse.next();
  }

  // Skip middleware for public API routes
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Skip middleware for static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/assets/") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg")
  ) {
    return NextResponse.next();
  }

  // Get the user's token with the session information
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token exists, redirect to login page
  if (!token) {
    console.log(`🔒 No authentication: redirecting ${pathname} to login`);
    return NextResponse.redirect(new URL("/", request.url));
  }

  const userRole = token.role as string;

  // Check if user is trying to access a role-specific route they shouldn't
  for (const [role, routes] of Object.entries(protectedRoutes)) {
    if (role === "authenticated") continue; // Skip the authenticated role check for now

    // If the path starts with a protected route prefix for a specific role
    if (routes.some((route) => pathname.startsWith(route))) {
      // If the user doesn't have the required role
      if (userRole !== role) {
        console.log(
          `🚫 Access denied: ${userRole} tried to access ${pathname} (requires ${role})`
        );

        // Return to appropriate dashboard based on user role
        let redirectPath = "/";
        if (userRole === "student") redirectPath = "/student/dashboard";
        else if (userRole === "faculty") redirectPath = "/faculty/page";
        else if (userRole === "coordinator")
          redirectPath = "/coordinator/dashboard";
        else if (userRole === "admin") redirectPath = "/admin/dashboard";
        else if (userRole === "guest") redirectPath = "/guest/dashboard";

        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
  }

  // For authenticated routes, we already checked token exists above
  if (
    protectedRoutes.authenticated.some((route) => pathname.startsWith(route))
  ) {
    // User is authenticated, allow access
    return NextResponse.next();
  }

  // For all other routes, allow access if authenticated
  return NextResponse.next();
}

// Configure matcher to run middleware only on specific paths
export const config = {
  matcher: [
    // Match all paths except specified ones
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
