import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type Role = "client" | "nutritionist" | "admin";

// Public routes
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

  // 1️⃣ Allow public routes
  if (publicRoutes.includes(path)) {
    return null;
  }

  // 2️⃣ Determine which cookie to check
  let tokenCookieName = "refreshToken";
  let loginRedirect = "/login";

  if (path.startsWith("/admin")) {
    tokenCookieName = "adminRefreshToken";
    loginRedirect = "/admin/login";
  }

  const token = req.cookies.get(tokenCookieName)?.value;

  // 3️⃣ No token → redirect immediately
  if (!token) {
    return NextResponse.redirect(new URL(loginRedirect, req.url));
  }

  try {
    // 4️⃣ Decode token without secret
    const decoded = jwt.decode(token) as { userId: string; role: Role } | null;

    if (!decoded?.role) {
      return NextResponse.redirect(new URL(loginRedirect, req.url));
    }

    const { role } = decoded;

    // 5️⃣ Role-based protection
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/nutritionist") && !["nutritionist", "admin"].includes(role)) {
      console.log(role);
      
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/") && !["client", "nutritionist", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return null; // All good
  } catch (err) {
    // Should rarely happen since decode doesn't throw
    console.log("JWT decode failed:", err);
    return NextResponse.redirect(new URL(loginRedirect, req.url));
  }
};
