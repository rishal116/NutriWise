"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CreditCard,
  Video,
  Users,
  MapPin,
  RefreshCw,
  LoaderCircle,
  CircleAlert,
} from "lucide-react";

import { userSessionService } from "@/services/user/user-session.service";

import type { UserSessionDetailsDTO } from "@/dtos/user/session/user-session-details.dto";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClass(status: string): string {
  switch (status) {
    case "registered":
    case "paid":
    case "attended":
    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "pending":
    case "scheduled":
      return "bg-amber-50 text-amber-700";

    case "cancelled":
    case "failed":
    case "refunded":
    case "absent":
      return "bg-red-50 text-red-700";

    case "live":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}
    >
      {formatLabel(status)}
    </span>
  );
}

export default function UserSessionDetailsPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const [session, setSession] = useState<UserSessionDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response =
        await userSessionService.getUserSessionDetails(sessionId);

      if (!response.data) {
        throw new Error("Session details were not returned.");
      }

      setSession(response.data);
    } catch {
      setError(
        "Unable to load this session. It may not exist or you may not have access to it.",
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails, refreshKey]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-96 max-w-7xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircle size={22} className="animate-spin text-emerald-600" />
          Loading session details...
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/user/dashboard/sessions"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to my sessions
        </Link>

        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-white p-6 sm:p-8"
        >
          <CircleAlert size={30} className="text-red-500" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Session unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {error ?? "The requested session could not be found."}
          </p>
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  const { session: details } = session;

  const formattedPrice =
    details.pricing.type === "free"
      ? "Free"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: details.pricing.currency,
        }).format(details.pricing.amount);

  const canJoin =
    session.registrationStatus === "registered" &&
    (session.paymentStatus === "paid" ||
      session.paymentStatus === "not_required") &&
    details.status === "live";

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/user/dashboard/sessions"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
      >
        <ArrowLeft size={17} />
        Back to my sessions
      </Link>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-emerald-50 sm:min-h-64">
          {details.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={details.thumbnailUrl}
              alt={details.title}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <Video size={64} className="text-emerald-600" />
          )}

          {details.status === "live" && (
            <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
              LIVE NOW
            </span>
          )}
        </div>

        <div className="space-y-5 p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                <StatusBadge status={session.registrationStatus} />
                <StatusBadge status={details.status} />
              </div>

              <p className="text-sm font-medium text-emerald-700">
                {formatLabel(details.type)}
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {details.title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {details.description}
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-gray-50 p-4 sm:min-w-40">
              <p className="text-sm text-gray-500">Session price</p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formattedPrice}
              </p>
              <div className="mt-2">
                <StatusBadge status={session.paymentStatus} />
              </div>
            </div>
          </div>

          {canJoin && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h2 className="font-semibold text-emerald-900">
                Your session is live
              </h2>

              <p className="mt-1 text-sm text-emerald-800">
                You are registered and ready to join this session.
              </p>

              <Link
                href={`/session-room/${session.sessionId}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Video size={18} />
                Join Session
              </Link>
            </div>
          )}

          {session.registrationStatus === "cancelled" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Your registration for this session has been cancelled.
            </div>
          )}

          {session.paymentStatus === "pending" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Your payment is still pending. Complete payment before joining a
              paid session.
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Schedule</h2>

          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CalendarDays size={19} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date and time</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(details.scheduledAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Clock3 size={19} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {details.durationInMinutes} minutes
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <MapPin size={19} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Session format</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  Online session
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Registration details</h2>

          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CalendarDays size={19} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered on</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(session.registeredAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CreditCard size={19} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment status</p>
                <div className="mt-1">
                  <StatusBadge status={session.paymentStatus} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Users size={19} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Maximum participants</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {details.maxParticipants}
                </p>
              </div>
            </div>

            {session.cancelledAt && (
              <div>
                <p className="text-sm text-gray-500">Cancelled on</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(session.cancelledAt)}
                </p>
              </div>
            )}

            {session.attendedAt && (
              <div>
                <p className="text-sm text-gray-500">Attended on</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(session.attendedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
