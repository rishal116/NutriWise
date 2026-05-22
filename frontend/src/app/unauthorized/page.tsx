"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function UnauthorizedPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const activeRole = user?.activeRole;

  const getHomeLink = () => {
    if (activeRole === "admin") return "/admin/dashboard";
    if (activeRole === "nutritionist") return "/nutritionist/dashboard";
    return "/home";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-6 text-center">
      <h1 className="text-6xl font-extrabold text-red-600">403</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        Unauthorized Access
      </h2>
      <p className="mt-2 max-w-md text-gray-600">
        You do not have permission to access this page.
      </p>

      <Link
        href={getHomeLink()}
        className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-emerald-700"
      >
        Go Home
      </Link>
    </div>
  );
}