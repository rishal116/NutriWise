import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type Role = "client" | "nutritionist" | "admin";

interface DecodedToken {
  userId: string;
  activeRole: Role;
  roles?: Role[];
}

const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/admin/login",
];

// Routes accessible for users applying to become nutritionists
const nutritionistPublicRoutes = [
  "/nutritionist/details",
  "/nutritionist/reapply",
  "/nutritionist/pending",
];

export const protectRoutes = (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  // Public routes
  if (publicRoutes.includes(path)) {
    return null;
  }

  let tokenCookieName = "refreshToken";
  let loginRedirect = "/login";

  // Admin routes
  if (path.startsWith("/admin")) {
    tokenCookieName = "adminRefreshToken";
    loginRedirect = "/admin/login";
  }

  const token = req.cookies.get(tokenCookieName)?.value;

  // No token
  if (!token) {
    return NextResponse.redirect(new URL(loginRedirect, req.url));
  }

  try {
   const decoded = jwt.decode(token) as DecodedToken;

    // Invalid token payload
    if (!decoded?.activeRole) {
      return NextResponse.redirect(new URL(loginRedirect, req.url));
    }

    const { activeRole, roles = [activeRole] } = decoded;


    // ─────────────────────────────
    // Admin Protection
    // ─────────────────────────────
    if (path.startsWith("/admin") && activeRole !== "admin") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }

    // ─────────────────────────────
    // Nutritionist application routes
    // ─────────────────────────────
    const isNutritionistPublicRoute =
      nutritionistPublicRoutes.some((route) =>
        path.startsWith(route)
      );

    // ─────────────────────────────
    // Nutritionist dashboard protection
    // ─────────────────────────────
    if (
      path.startsWith("/nutritionist") &&
      !isNutritionistPublicRoute &&
      !roles.includes("nutritionist") &&
      activeRole !== "admin"
    ) {
      console.log("jrjjr");
      
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }

    return null;
  } catch {
    return NextResponse.redirect(
      new URL(loginRedirect, req.url)
    );
  }
};