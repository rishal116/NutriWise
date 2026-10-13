
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, CreditCard, LoaderCircle, ShieldCheck } from "lucide-react";

import { publicSessionService } from "@/services/public/publicSession.service";
import { sessionCheckoutService } from "@/services/public/sessionCheckout.service";
import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function SessionCheckoutPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [session, setSession] =
    useState<PublicSessionDetailsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchSession = async () => {
      try {
        const response =
          await publicSessionService.getSessionDetails(sessionId);

        if (cancelled) return;

        const fetchedSession = response.data;

        if (
          fetchedSession.pricing.type !== "paid" ||
          !["scheduled", "live"].includes(fetchedSession.status)
        ) {
          setError("This session is not available for paid registration.");
          return;
        }

        setSession(fetchedSession);
      } catch (fetchError: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(fetchError));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (sessionId) {
      void fetchSession();
    } else {
      setError("Invalid session.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const handleProceedToPayment = useCallback(async () => {
    if (!session || !acceptedTerms || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      // Backend validates the session and creates the Stripe Checkout Session.
      const response =
        await sessionCheckoutService.createSessionRegistrationCheckout(
          session.sessionId,
        );

      const checkoutUrl = response.data.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Unable to create the payment session.");
      }

      // Navigate to Stripe's hosted Checkout page.
      window.location.assign(checkoutUrl);
    } catch (checkoutError: unknown) {
      setError(getErrorMessage(checkoutError));
      setSubmitting(false);
    }
  }, [session, acceptedTerms, submitting]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-gray-500">Loading checkout...</p>
      </main>
    );
  }

  if (error && !session) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p role="alert" className="text-sm text-red-600">{error}</p>
        <Link
          href={`/communities/sessions/${sessionId}`}
          className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to session
        </Link>
      </main>
    );
  }

  if (!session) return null;

  const date = new Date(session.scheduledAt);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link
        href={`/communities/sessions/${session.sessionId}`}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to session
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review your session details before proceeding to payment.
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {session.thumbnailUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={session.thumbnailUrl}
              alt={session.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-5 p-5 sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {session.type.replaceAll("_", " ")}
            </p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {session.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {session.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-emerald-50">
              {session.nutritionist.profileImage ? (
                <Image
                  src={session.nutritionist.profileImage}
                  alt={session.nutritionist.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-lg font-semibold text-emerald-700">
                  {session.nutritionist.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Hosted by</p>
              <p className="font-medium text-gray-900">
                {session.nutritionist.name}
              </p>
            </div>
          </div>

          <div className="grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <p className="text-xs text-gray-500">Date and time</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {date.toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {session.durationInMinutes} minutes
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Session fee</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{session.pricing.amount.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-gray-500">
              Amount charged in {session.pricing.currency.toUpperCase()}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <h2 className="font-semibold text-gray-900">
              Terms and conditions
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Please review the session booking, attendance, cancellation,
              and refund policies before continuing.
            </p>
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-emerald-700 underline"
            >
              Read terms and conditions
            </Link>
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-1 h-4 w-4 accent-emerald-600"
          />
          <span className="text-sm leading-6 text-gray-700">
            I have read and agree to the terms and conditions for this session.
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => void handleProceedToPayment()}
          disabled={!acceptedTerms || submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Preparing payment...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Agree & Proceed to Payment
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          You will be redirected to Stripe to complete your payment securely.
        </p>
      </section>
    </main>
  );
}
