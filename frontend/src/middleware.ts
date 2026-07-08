import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectRoutes } from "@/middlewares/protectRoutes.middleware";

export function middleware(req: NextRequest) {
  console.log("Middleware:", req.nextUrl.pathname);

  const response = protectRoutes(req);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: [
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
