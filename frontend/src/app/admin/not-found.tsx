"use client";

import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Admin page not found.</p>
      <Link href="/admin/dashboard" className="text-blue-500 underline">
        Go back to Admin Dashboard
      </Link>
    </div>
  );
}
