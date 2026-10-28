"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  Search,
  RefreshCw,
  ChevronRight,
  Users,
  Video,
  XCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { userSessionService } from "@/services/user/user-session.service";

import type { UserSessionListItemDTO } from "@/dtos/user/session/user-session.dto";
import type {
  UserSessionListQueryDTO,
  UserSessionSortBy,
} from "@/dtos/user/session/user-session-list-query.dto";

const REGISTRATION_STATUSES = [
  "registered",
  "cancelled",
  "attended",
  "absent",
] as const;

const PAYMENT_STATUSES = [
  "not_required",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

const SESSION_TYPES = [
  "webinar",
  "workshop",
  "group_consultation",
  "qna",
  "seminar",
] as const;

const SORT_OPTIONS: { label: string; value: UserSessionSortBy }[] = [
  { label: "Upcoming first", value: "upcoming" },
  { label: "Recently registered", value: "latest" },
  { label: "Oldest registration", value: "oldest" },
  { label: "Title A–Z", value: "title_asc" },
  { label: "Title Z–A", value: "title_desc" },
];

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
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
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(status)}`}
    >
      {formatLabel(status)}
    </span>
  );
}

export default function UserSessionsPage() {
  const [sessions, setSessions] = useState<UserSessionListItemDTO[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState<UserSessionListQueryDTO>({
    sortBy: "upcoming",
    limit: 10,
  });

  const [registrationStatus, setRegistrationStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sessionType, setSessionType] = useState("");

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchSessions = useCallback(
    async (cursor?: string, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await userSessionService.getUserSessions({
          ...query,
          ...(cursor ? { cursor } : {}),
        });

        const result = response.data;

        if (!result) {
          throw new Error("Session list data was not returned.");
        }

        setSessions((previous) =>
          append ? [...previous, ...result.items] : result.items,
        );

        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch {
        setError("Unable to load your sessions. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query],
  );

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions, refreshKey]);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setQuery({
      search: searchInput.trim() || undefined,
      registrationStatus:
        (registrationStatus as UserSessionListQueryDTO["registrationStatus"]) ||
        undefined,
      paymentStatus:
        (paymentStatus as UserSessionListQueryDTO["paymentStatus"]) ||
        undefined,
      sessionType:
        (sessionType as UserSessionListQueryDTO["sessionType"]) || undefined,
      sortBy: query.sortBy ?? "upcoming",
      limit: 10,
    });
  }

  function handleResetFilters() {
    setSearchInput("");
    setRegistrationStatus("");
    setPaymentStatus("");
    setSessionType("");
    setQuery({ sortBy: "upcoming", limit: 10 });
  }

  function handleSortChange(sortBy: UserSessionSortBy) {
    setQuery((previous) => ({ ...previous, sortBy, cursor: undefined }));
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-700">User dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            My sessions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your registrations and keep track of upcoming sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading || loadingMore}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      <form
        onSubmit={handleFilterSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="session-search"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Search sessions
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 focus-within:border-emerald-500">
              <Search size={17} className="shrink-0 text-gray-400" />
              <input
                id="session-search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by session title..."
                maxLength={100}
                className="w-full py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="registration-status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Registration
            </label>
            <select
              id="registration-status"
              value={registrationStatus}
              onChange={(event) => setRegistrationStatus(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">All registrations</option>
              {REGISTRATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="session-type"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Session type
            </label>
            <select
              id="session-type"
              value={sessionType}
              onChange={(event) => setSessionType(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">All types</option>
              {SESSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Payment
            </label>
            <select
              id="payment-status"
              value={paymentStatus}
              onChange={(event) => setPaymentStatus(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">All payments</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="session-sort"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Sort by
            </label>
            <select
              id="session-sort"
              value={query.sortBy ?? "upcoming"}
              onChange={(event) =>
                handleSortChange(event.target.value as UserSessionSortBy)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Search size={16} />
            Apply filters
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-56 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <LoaderCircle size={20} className="animate-spin text-emerald-600" />
            Loading your sessions...
          </div>
        </div>
      ) : sessions.length === 0 && !error ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
            <CalendarDays size={26} className="text-emerald-600" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No sessions found
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            You don&apos;t have any sessions matching these filters. Try
            changing your filters or explore available sessions.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              Your registrations
            </h2>
            <span className="text-sm text-gray-500">
              {sessions.length} loaded
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {sessions.map((item) => (
                <li key={item.registrationId}>
                  <Link
                    href={`/user/sessions/${item.sessionId}`}
                    className="group flex flex-col gap-4 p-4 transition hover:bg-emerald-50/40 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50">
                      {item.session.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.session.thumbnailUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <Video size={25} className="text-emerald-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700">
                          {item.session.title}
                        </h3>
                        <StatusBadge status={item.registrationStatus} />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span>{formatLabel(item.session.type)}</span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} />
                          {formatDate(item.session.scheduledAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={15} />
                          {item.session.durationInMinutes} min
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.paymentStatus} />
                        <span className="text-sm font-medium text-gray-700">
                          {item.session.pricing.type === "free"
                            ? "Free"
                            : new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: item.session.pricing.currency,
                              }).format(item.session.pricing.amount)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={20}
                      className="hidden shrink-0 text-gray-400 group-hover:text-emerald-600 sm:block"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasMore && nextCursor && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => void fetchSessions(nextCursor, true)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
              >
                {loadingMore ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Users size={17} />
                )}
                {loadingMore ? "Loading..." : "Load more sessions"}
              </button>
            </div>
          )}

          {!hasMore && sessions.length > 0 && (
            <p className="py-2 text-center text-sm text-gray-400">
              You&apos;ve reached the end of your sessions.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
