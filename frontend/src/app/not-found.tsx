"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Illustration */}
          <div className="hidden md:flex items-center justify-center bg-green-50 p-10">
            {/* Simple friendly SVG illustration */}
            <svg
              width="260"
              height="220"
              viewBox="0 0 260 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="6" y="6" width="248" height="208" rx="20" fill="#E8F5E9" />
              <g transform="translate(30,30)">
                <circle cx="60" cy="50" r="34" fill="#2E7D32" opacity="0.12" />
                <path d="M120 30c-6 0-11 5-11 11v28c0 6 5 11 11 11s11-5 11-11V41c0-6-5-11-11-11z" fill="#2E7D32" opacity="0.16"/>
                <rect x="6" y="90" width="180" height="12" rx="6" fill="#C8E6C9"/>
                <rect x="6" y="110" width="120" height="12" rx="6" fill="#C8E6C9"/>
                <rect x="6" y="130" width="150" height="12" rx="6" fill="#C8E6C9"/>
                <path d="M36 46c6-4 14-6 22-6 10 0 20 4 27 12" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-extrabold text-green-800 mb-3">404 — Page not found</h1>
            <p className="text-gray-700 mb-6">
              Oops — the page you’re looking for doesn’t exist or has been moved. If you arrived here after submitting a form, your submission may still be processing.
            </p>

            <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-3 rounded-2xl font-semibold shadow"
                aria-label="Go to homepage"
              >
                <Home size={16} /> Go to Home
              </button>

              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 border border-green-200 hover:border-green-300 text-green-800 px-4 py-3 rounded-2xl font-medium bg-white"
                aria-label="Go back"
              >
                <ArrowLeft size={16} /> Go back
              </button>

              <Link href="/support" className="ml-0 md:ml-4 text-sm text-green-700 underline">
                Contact support
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                Tip: try checking the URL for typos, or go to the dashboard to continue your work.
              </p>
              <div className="mt-3">
                <Link href="/" className="text-green-600 hover:underline">Return to Dashboard</Link>
                <span className="mx-2 text-gray-300">•</span>
                <Link href="/nutritionist/details" className="text-green-600 hover:underline">Nutritionist Profile</Link>
              </div>
            </div>

            {/* small footer */}
            <div className="mt-10 text-xs text-gray-400">
              © {new Date().getFullYear()} YourAppName. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
