"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("plan");

  useEffect(() => {
    if (!slug) {
      router.replace("/");
    }
  }, [slug, router]);

  // Prevent flashing the cancel UI before the redirect effect runs
  if (!slug) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8 max-w-md w-full text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-50">
          <XCircle className="text-amber-600" size={36} />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Payment Cancelled
        </h1>

        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          Your payment was cancelled and you have not been charged. You can try
          again whenever you&apos;re ready.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push(`/checkout?plan=${slug}`)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 py-3 text-white text-sm sm:text-base font-semibold shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <RotateCcw size={16} className="flex-shrink-0" />
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded-xl bg-white border border-slate-200 py-3 text-slate-600 text-sm sm:text-base font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors duration-150"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
