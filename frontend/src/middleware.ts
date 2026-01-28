import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectRoutes } from "@/middlewares/protectRoutes.middleware";

export function middleware(req: NextRequest) {
  const response = protectRoutes(req);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
