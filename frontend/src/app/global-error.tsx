"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md border border-gray-200">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <AlertTriangle className="text-emerald-500 w-14 h-14" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Oops! Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          An unexpected error occurred. Please try again or return to the dashboard.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/admin/dashboard"
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-400 mt-10">
        © {new Date().getFullYear()} NutriWise Admin
      </p>
    </div>
  );
}
