"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { checkoutService } from "@/services/user/checkout.service";
import { CheckoutStatusData } from "@/types/checkout.types";

type VerificationState = "verifying" | "completed" | "pending_timeout" | "failed";

const MAX_POLL_ATTEMPTS = 10;
const POLL_INTERVAL_MS = 2000;

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState<VerificationState>("verifying");
  const [statusData, setStatusData] = useState<CheckoutStatusData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [pollCount, setPollCount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const checkStatus = useCallback(
    async (currentPollCount: number) => {
      if (!sessionId) return;

      try {
        const response = await checkoutService.getStatus(sessionId);
        const data = response.data;
        setStatusData(data);

        if (data.status === "completed") {
          clearTimer();
          setState("completed");
          return;
        }

        if (data.status === "failed") {
          clearTimer();
          setErrorMessage(data.message || "Payment verification failed.");
          setState("failed");
          return;
        }

        // Still pending
        if (currentPollCount < MAX_POLL_ATTEMPTS) {
          setPollCount(currentPollCount + 1);
          pollTimerRef.current = setTimeout(() => {
            checkStatus(currentPollCount + 1);
          }, POLL_INTERVAL_MS);
        } else {
          clearTimer();
          setState("pending_timeout");
        }
      } catch (error: unknown) {
        if (currentPollCount < MAX_POLL_ATTEMPTS) {
          setPollCount(currentPollCount + 1);
          pollTimerRef.current = setTimeout(() => {
            checkStatus(currentPollCount + 1);
          }, POLL_INTERVAL_MS);
        } else {
          clearTimer();
          setState("pending_timeout");
        }
      }
    },
    [sessionId],
  );

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
      return;
    }

    checkStatus(0);

    return () => {
      clearTimer();
    };
  }, [sessionId, router, checkStatus]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setState("verifying");
    setPollCount(0);
    await checkStatus(0);
    setIsRefreshing(false);
  };

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8 max-w-md w-full text-center">
        {state === "verifying" && (
          <div className="py-4">
            <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-50">
              <Loader2 className="text-emerald-600 animate-spin" size={32} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Verifying Payment
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              We are verifying your Stripe transaction and confirming your purchase...
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <span>Attempt {pollCount + 1} of {MAX_POLL_ATTEMPTS}</span>
            </div>
          </div>
        )}

        {state === "completed" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle className="text-emerald-600" size={36} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Payment Successful!
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Your nutrition coaching plan has been purchased and activated successfully.
            </p>

            {statusData?.itemTitle && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 font-medium text-left">
                <div className="text-slate-400 text-xs">Plan</div>
                <div className="text-slate-900 font-semibold">{statusData.itemTitle}</div>
                {statusData.amount && statusData.currency && (
                  <div className="mt-1 text-emerald-700 font-bold uppercase">
                    {statusData.currency} {statusData.amount.toFixed(2)}
                  </div>
                )}
              </div>
            )}

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
        )}

        {state === "pending_timeout" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-50">
              <Clock className="text-amber-600" size={36} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Payment Confirmation Pending
            </h1>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              We received your Stripe payment authorization, but your purchase activation is still processing.
            </p>

            <p className="text-xs text-slate-400 mt-2">
              If your plan does not activate within a few minutes, click below to re-check or contact support.
            </p>

            <p className="text-xs text-slate-400 mt-4 truncate font-medium">
              Ref: {sessionId}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-white text-sm font-semibold shadow-xs transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                Check Status Again
              </button>

              <button
                onClick={() => router.push("/user/programs")}
                className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-slate-700 text-sm font-semibold transition-all duration-300"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {state === "failed" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="text-red-600" size={36} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Payment Verification Failed
            </h1>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {errorMessage || "We could not verify your Stripe payment completion."}
            </p>

            <p className="text-xs text-slate-400 mt-4 truncate font-medium">
              Ref: {sessionId}
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-6 w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-white text-sm font-semibold shadow-xs transition-all duration-300"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

