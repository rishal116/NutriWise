"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Search, Users } from "lucide-react";

import { PAYMENT_STATUSES } from "@/constants/common/payment.constants";
import { SESSION_REGISTRATION_STATUSES } from "@/constants/common/session-registration.constants";

import { nutriSessionService } from "@/services/nutritionist/nutri-session.service";

import type { NutriSessionParticipantsQueryDTO } from "@/dtos/nutritionist/session-registration/nutri-session-participants-query.dto";
import type { NutriSessionParticipantResponseDTO } from "@/dtos/nutritionist/session-registration/nutri-session-participant-response.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

type RegistrationStatus = (typeof SESSION_REGISTRATION_STATUSES)[number];

type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const REGISTRATION_OPTIONS = [
  { value: "", label: "All registrations" },
  ...SESSION_REGISTRATION_STATUSES.map((status) => ({
    value: status,
    label: status.replaceAll("_", " "),
  })),
];

const PAYMENT_OPTIONS = [
  { value: "", label: "All payments" },
  ...PAYMENT_STATUSES.map((status) => ({
    value: status,
    label: status.replaceAll("_", " "),
  })),
];

const STATUS_STYLES: Record<RegistrationStatus, string> = {
  registered: "bg-sky-50 text-sky-700",
  attended: "bg-emerald-50 text-emerald-700",
  absent: "bg-amber-50 text-amber-700",
  cancelled: "bg-rose-50 text-rose-700",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
  partially_refunded: "bg-orange-50 text-orange-700",
  refunded: "bg-violet-50 text-violet-700",
};

interface SessionParticipantsProps {
  sessionId: string;
  isFree: boolean;
}

export default function SessionParticipants({
  sessionId,
  isFree,
}: SessionParticipantsProps) {
  const [participants, setParticipants] = useState<
    NutriSessionParticipantResponseDTO[]
  >([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState<RegistrationStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  // Debounce participant search.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  // Fetch participants with cursor pagination.
  const fetchParticipants = useCallback(
    async (reset: boolean) => {
      if (loadingRef.current) {
        return;
      }

      if (!reset && !nextCursorRef.current) {
        return;
      }

      loadingRef.current = true;

      const requestId = ++requestIdRef.current;

      if (reset) {
        setLoading(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const query: NutriSessionParticipantsQueryDTO = {
        limit: 10,
        search: debouncedSearch || undefined,
        status: status || undefined,
        paymentStatus: !isFree && paymentStatus ? paymentStatus : undefined,
        cursor: reset ? undefined : (nextCursorRef.current ?? undefined),
      };

      try {
        const response = await nutriSessionService.getSessionParticipants(
          sessionId,
          query,
        );

        // Ignore responses from outdated requests.
        if (requestId !== requestIdRef.current) {
          return;
        }

        const result = response.data;

        if (!result) {
          throw new Error(
            "Session participants are missing from the API response.",
          );
        }

        setParticipants((current) =>
          reset ? result.items : [...current, ...result.items],
        );

        nextCursorRef.current = result.nextCursor;
        setHasMore(result.hasMore);
      } catch (fetchError: unknown) {
        if (requestId === requestIdRef.current) {
          setError(getErrorMessage(fetchError));
        }
      } finally {
        if (requestId === requestIdRef.current) {
          loadingRef.current = false;
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [debouncedSearch, isFree, paymentStatus, sessionId, status],
  );

  // Reset pagination whenever filters or search change.
  useEffect(() => {
    requestIdRef.current += 1;
    loadingRef.current = false;
    nextCursorRef.current = null;

    setHasMore(true);
    setParticipants([]);
    setError(null);

    void fetchParticipants(true);
  }, [fetchParticipants]);

  // Automatically load the next page when the sentinel is visible.
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel ||
      !hasMore ||
      loading ||
      loadingMore ||
      error ||
      participants.length === 0
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void fetchParticipants(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [
    error,
    fetchParticipants,
    hasMore,
    loading,
    loadingMore,
    participants.length,
  ]);

  // Retry the failed request.
  const handleRetry = useCallback(() => {
    void fetchParticipants(participants.length === 0);
  }, [fetchParticipants, participants.length]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1 rounded-full bg-emerald-600" />

            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Participants
            </h2>
          </div>

          <p className="mt-1 pl-3.5 text-sm text-slate-500">
            Search registrations and check participant details.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 sm:self-auto">
          <Users className="h-4 w-4" />

          {participants.length}

          <span className="font-medium text-emerald-600">loaded</span>
        </div>
      </div>

      {/* Search and filters */}
      <div
        className={`mt-5 grid gap-3 ${
          isFree
            ? "md:grid-cols-[minmax(0,1fr)_200px]"
            : "md:grid-cols-[minmax(0,1fr)_200px_200px]"
        }`}
      >
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search participant name..."
            aria-label="Search participants by name"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
          />
        </label>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as RegistrationStatus | "")
          }
          aria-label="Filter by registration status"
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
        >
          {REGISTRATION_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {!isFree && (
          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(event.target.value as PaymentStatus | "")
            }
            aria-label="Filter by payment status"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="mt-5 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-rose-700">{error}</p>

          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Initial loading */}
      {loading ? (
        <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          Loading participants...
        </div>
      ) : participants.length === 0 && !error ? (
        /* Empty state */
        <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-center">
          <Users className="h-8 w-8 text-slate-300" />

          <p className="mt-2 text-sm font-semibold text-slate-700">
            No participants found
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : participants.length > 0 ? (
        /* Participants table */
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-3 py-3">Participant</th>
                <th className="px-3 py-3">Registration</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Registered on</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {participants.map((participant) => (
                <tr
                  key={participant.registrationId}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  {/* Participant */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      {participant.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={participant.profileImage}
                          alt=""
                          className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                          {participant.fullName
                            .trim()
                            .charAt(0)
                            .toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="max-w-56 truncate text-sm font-semibold text-slate-800">
                          {participant.fullName}
                        </p>

                        <p className="max-w-56 truncate text-xs text-slate-500">
                          @{participant.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Registration status */}
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        STATUS_STYLES[participant.status]
                      }`}
                    >
                      {participant.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  {/* Payment status */}
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        isFree
                          ? "bg-slate-100 text-slate-600"
                          : participant.paymentStatus
                            ? PAYMENT_STYLES[participant.paymentStatus]
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isFree
                        ? "Free"
                        : participant.paymentStatus
                          ? participant.paymentStatus.replaceAll("_", " ")
                          : "No payment"}
                    </span>
                  </td>

                  {/* Registration date */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                    {new Date(participant.registeredAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Infinite scroll sentinel */}
          <div
            ref={sentinelRef}
            className="flex min-h-14 items-center justify-center"
          >
            {loadingMore && (
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                Loading more participants...
              </span>
            )}

            {!hasMore && (
              <p className="text-xs text-slate-400">
                You&apos;ve reached the end of the list.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
