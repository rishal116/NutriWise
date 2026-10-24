
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { protectRoutes } from "@/middlewares/protectRoutes.middleware";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const activeRole = req.cookies.get("nutriwise_active_role")?.value;

    if (activeRole === "nutritionist") {
      return NextResponse.redirect(
        new URL("/nutritionist/dashboard", req.url),
      );
    }

    if (activeRole === "admin") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", req.url),
      );
    }
  }

  const response = protectRoutes(req);

  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/verify-otp/:path*",
    "/forgot-password",
    "/reset-password/:path*",
    "/user/:path*",
    "/nutritionist/:path*",
    "/admin/:path*",
    "/complete-profile/:path*",
  ],
};
