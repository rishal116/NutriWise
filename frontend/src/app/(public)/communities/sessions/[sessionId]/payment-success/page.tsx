
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, CircleAlert, Clock3, LoaderCircle } from "lucide-react";

import { sessionCheckoutService } from "@/services/public/sessionCheckout.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

type PaymentStatus = "pending" | "completed" | "failed";

const MAX_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 2000;

export default function SessionPaymentSuccessPage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(
    null,
  );
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setCheckoutSessionId(query.get("session_id"));
  }, []);

  useEffect(() => {
    if (!checkoutSessionId || !sessionId) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const checkPayment = async (): Promise<void> => {
      try {
        const response =
          await sessionCheckoutService.getSessionPaymentStatus(
            checkoutSessionId,
          );

        if (cancelled) return;

        const paymentStatus = response.data.status as PaymentStatus;

        if (
          paymentStatus !== "pending" &&
          paymentStatus !== "completed" &&
          paymentStatus !== "failed"
        ) {
          setError("Received an invalid payment status.");
          setLoading(false);
          return;
        }

        setStatus(paymentStatus);

        if (paymentStatus === "completed" || paymentStatus === "failed") {
          setLoading(false);
          return;
        }

        attempts += 1;

        if (attempts >= MAX_ATTEMPTS) {
          setError(
            "Payment confirmation is taking longer than expected. Please check again shortly.",
          );
          setLoading(false);
          return;
        }

        timeout = setTimeout(() => {
          void checkPayment();
        }, POLL_INTERVAL_MS);
      } catch (paymentError: unknown) {
        if (cancelled) return;

        setError(getErrorMessage(paymentError));
        setLoading(false);
      }
    };

    void checkPayment();

    return () => {
      cancelled = true;

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [checkoutSessionId, sessionId]);

  if (!checkoutSessionId) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <CircleAlert className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Unable to verify payment
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          The checkout session ID is missing. Please check your registration
          status before attempting payment again.
        </p>
        <Link
          href={`/communities/sessions/${sessionId}`}
          className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Return to session
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-emerald-600" />
        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Verifying your payment
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Please wait while we confirm your payment and registration.
        </p>
      </main>
    );
  }

  if (status === "completed") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Payment successful!
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your payment has been confirmed. You can now continue to your
          session.
        </p>
        <Link
          href={`/session-room/${sessionId}`}
          className="mt-7 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Enter session room
        </Link>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <CircleAlert className="mx-auto h-14 w-14 text-red-500" />
        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Payment not completed
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Your payment has not been confirmed. Check your registration status
          before trying again.
        </p>
        <Link
          href={`/communities/sessions/${sessionId}`}
          className="mt-7 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Return to session
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <Clock3 className="mx-auto h-14 w-14 text-amber-500" />
      <h1 className="mt-5 text-2xl font-bold text-gray-900">
        Payment confirmation pending
      </h1>
      <p className="mt-3 text-sm leading-6 text-gray-600">
        {error ??
          "Your payment has not been confirmed yet. Please allow some time for processing."}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        You do not need to pay again while the status is being checked.
      </p>
      <Link
        href={`/communities/sessions/${sessionId}`}
        className="mt-7 inline-flex rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Return to session
      </Link>
    </main>
  );
}
