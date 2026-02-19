import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type Role = "client" | "nutritionist" | "admin";

const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/admin/login",
];

export const protectRoutes = (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  if (publicRoutes.includes(path)) {
    return null;
  }
  
  let tokenCookieName = "refreshToken";
  let loginRedirect = "/login";
  if (path.startsWith("/admin")) {
    tokenCookieName = "adminRefreshToken";
    loginRedirect = "/admin/login";
  }
  
  const token = req.cookies.get(tokenCookieName)?.value;
  if (!token) {
    return NextResponse.redirect(new URL(loginRedirect, req.url));
  }

  try {
    const decoded = jwt.decode(token) as { userId: string; role: Role } | null;
    if (!decoded?.role) {
      return NextResponse.redirect(new URL(loginRedirect, req.url));
    }
    const { role } = decoded;
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/nutritionist") && !["nutritionist", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/") && !["client", "nutritionist", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return null;
  } catch (err) {
    console.log("JWT decode failed:", err);
    return NextResponse.redirect(new URL(loginRedirect, req.url));
  }
};
