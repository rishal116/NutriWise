import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

import { UserRole } from "@/enums/user/user.enum";

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export function redirectAuthenticatedUsers(req: NextRequest): NextResponse {
  const token = req.cookies.get("refreshToken")?.value;

  if (!token) {
    return NextResponse.next();
  }

  try {
    const payload = jwt.decode(token) as JwtPayload | null;

    if (!payload?.userId || !payload.activeRole) {
      return NextResponse.next();
    }

    switch (payload.activeRole) {
      case UserRole.ADMIN:
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));

      case UserRole.NUTRITIONIST:
        return NextResponse.redirect(
          new URL("/nutritionist/dashboard", req.url),
        );

      case UserRole.USER:
      default:
        return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return NextResponse.next();
  }
}
