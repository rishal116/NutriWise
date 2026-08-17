"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
    }
  }, [sessionId, router]);

  // Prevent flashing the success UI before the redirect effect runs
  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8 max-w-md w-full text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="text-emerald-600" size={36} />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Payment Successful
        </h1>

        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
          Your nutrition coaching plan has been purchased successfully.
        </p>

        <p className="text-xs text-slate-400 mt-4 truncate font-medium">
          Ref: {sessionId}
        </p>

        <button
          onClick={() => router.push("/user/programs")}
          className="mt-6 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 py-3 text-white text-sm sm:text-base font-semibold shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
