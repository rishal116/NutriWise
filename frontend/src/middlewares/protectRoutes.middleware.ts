import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserRole } from "@/enums/user/user.enum";
import { redirectAuthenticatedUsers } from "@/utils/redirectAuthenticatedUser";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/signup",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

const USER_ROUTES = ["/user", "/complete-profile"];

const NUTRITIONIST_ROUTES = ["/nutritionist"];

const ADMIN_ROUTES = ["/admin"];

export const protectRoutes = (req: NextRequest): NextResponse => {
  const { pathname } = req.nextUrl;

  if (isProtectedRoute(pathname, PUBLIC_AUTH_ROUTES)) {
    return redirectAuthenticatedUsers(req);
  }

  if (isProtectedRoute(pathname, ADMIN_ROUTES)) {
    return authorize(req, UserRole.ADMIN);
  }

  if (isProtectedRoute(pathname, NUTRITIONIST_ROUTES)) {
    return authorize(req, UserRole.NUTRITIONIST);
  }

  if (isProtectedRoute(pathname, USER_ROUTES)) {
    return authorize(req);
  }

  return NextResponse.next();
};

function isProtectedRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function authorize(req: NextRequest, requiredRole?: UserRole): NextResponse {
  const token = req.cookies.get("refreshToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = jwt.decode(token) as JwtPayload | null;

    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (requiredRole && payload.activeRole !== requiredRole) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
