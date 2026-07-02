import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserRole } from "@/enums/user/userRole.enum";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

const protectedRoutes = [
  "/profile",
  "/messages",
  "/settings",
  "/notifications",
  "/complete-profile",
];

export const protectRoutes = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    return authorize(req, UserRole.ADMIN);
  }

  if (pathname.startsWith("/nutritionist")) {
    return authorize(req, UserRole.NUTRITIONIST);
  }

  if (pathname.startsWith("/user")) {
    return authorize(req);
  }

  // General authenticated routes
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected) {
    return authorize(req);
  }

  // Everything else is public
  return NextResponse.next();
};

function authorize(
  req: NextRequest,
  requiredRole?: UserRole,
): NextResponse | null {
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
