import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserRole } from "@/enums/user/user.enum";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export function redirectAuthenticatedUsers(req: NextRequest): NextResponse {
  const token = req.cookies.get("refreshToken")?.value;

  console.log("Token:", token);

  if (!token) {
    console.log("No refresh token");
    return NextResponse.next();
  }

  try {
    const payload = jwt.decode(token) as JwtPayload | null;

    if (!payload) {
      return NextResponse.next();
    }
    console.log("Payload:", payload);

    switch (payload.activeRole) {
      case UserRole.ADMIN:
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));

      case UserRole.NUTRITIONIST:
        return NextResponse.redirect(
          new URL("/nutritionist/dashboard", req.url),
        );

      default:
        return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (err) {
    console.log("JWT Error:", err);
    return NextResponse.next();
  }
}
