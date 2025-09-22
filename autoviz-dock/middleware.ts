import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token and role from cookies or headers
  const token = request.cookies.get("auth_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")
  const role = request.cookies.get("auth_role")?.value

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/find-id"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Admin routes that require admin role
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Protected routes that require authentication
  const protectedRoutes = ["/app"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // If accessing public route and authenticated, redirect based on role
  if (isPublicRoute && token && role) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else {
      return NextResponse.redirect(new URL("/app", request.url))
    }
  }

  // If accessing admin route without admin role, redirect to login
  if (isAdminRoute && (!token || role !== "admin")) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
