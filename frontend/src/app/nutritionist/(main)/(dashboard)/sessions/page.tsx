"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  Users,
  ImageOff,
  AlertCircle,
  Loader2,
  CalendarX2,
  RotateCw,
} from "lucide-react";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import type { NutriSessionListResponseDTO } from "@/dtos/nutritionist/session/session-list-response.dto";
import type {
  SessionCurrency,
  SessionType,
  SessionStatus,
} from "@/types/nutritionist/session/session.types";
import {
  NUTRI_SESSION_SORT_OPTIONS,
  type GetNutriSessionsQueryDTO,
  type NutriSessionSortOption,
} from "@/dtos/nutritionist/session/session-list-query.dto";

// ---------------------------------------------------------------------------
// Static option lists — sourced directly from the locked contract, nothing invented
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: { value: SessionType; label: string }[] = [
  { value: "webinar", label: "Webinar" },
  { value: "workshop", label: "Workshop" },
  { value: "group_consultation", label: "Group Consultation" },
  { value: "qna", label: "Q&A" },
  { value: "seminar", label: "Seminar" },
];

const STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const SORT_LABELS: Record<NutriSessionSortOption, string> = {
  latest: "Latest",
  oldest: "Oldest",
  title_asc: "Title A–Z",
  title_desc: "Title Z–A",
  date_asc: "Date: Soonest",
  date_desc: "Date: Latest",
};

const TYPE_LABELS: Record<SessionType, string> = TYPE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.value]: o.label }),
  {} as Record<SessionType, string>,
);

const STATUS_STYLES: Record<SessionStatus, string> = {
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const CURRENCY_SYMBOLS: Record<SessionCurrency, string> = {
  inr: "₹",
  usd: "$",
  eur: "€",
  gbp: "£",
  aed: "د.إ",
};

const PAGE_LIMIT = 12;

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatScheduledAt(iso: string) {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

function formatPrice(pricing: NutriSessionListResponseDTO["pricing"]) {
  if (pricing.type === "free") return "Free";
  const symbol = CURRENCY_SYMBOLS[pricing.currency];
  return `${symbol}${pricing.amount.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: SessionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function PricingPill({
  pricing,
}: {
  pricing: NutriSessionListResponseDTO["pricing"];
}) {
  if (pricing.type === "free") {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        Free
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-800">
      {formatPrice(pricing)}
    </span>
  );
}

function SessionCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="h-36 w-full animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: NutriSessionListResponseDTO }) {
  const router = useRouter();
  const { date, time } = formatScheduledAt(session.scheduledAt);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-150 hover:shadow-lg">
      <div className="relative h-36 w-full shrink-0 bg-slate-100">
        {session.thumbnailUrl ? (
          <Image
            src={session.thumbnailUrl}
            alt={session.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-6 w-6 text-slate-300" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusPill status={session.status} />
        </div>
        <div className="absolute right-3 top-3">
          <PricingPill pricing={session.pricing} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            {TYPE_LABELS[session.type]}
          </p>
          <h3 className="line-clamp-1 text-base font-bold tracking-tight text-slate-900">
            {session.title}
          </h3>
          <p className="line-clamp-2 text-xs font-medium text-slate-500">
            {session.description}
          </p>
        </div>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              {date} · {time}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{formatDuration(session.durationInMinutes)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Up to {session.maxParticipants}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(`/nutritionist/sessions/${session.sessionId}`)
          }
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors duration-150 hover:bg-slate-50"
        >
          View details
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SessionsPage() {
  const router = useRouter();

  const [sessions, setSessions] = useState<NutriSessionListResponseDTO[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<SessionStatus | "">("");
  const [type, setType] = useState<SessionType | "">("");
  const [sortBy, setSortBy] = useState<NutriSessionSortOption>("latest");

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const fetchingMoreRef = useRef(false);
  const resettingRef = useRef(false);
  const skipRef = useRef(false);

  const searchRef = useRef(debouncedSearch);
  const statusRef = useRef(status);
  const typeRef = useRef(type);
  const sortRef = useRef(sortBy);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Debounce free-text search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(id);
  }, [search]);

  const fetchSessions = useCallback(async (reset: boolean) => {
    if (reset) {
      if (resettingRef.current) return;
      resettingRef.current = true;
      setInitialLoading(true);
      setError(null);
    } else {
      if (fetchingMoreRef.current || !hasMoreRef.current) return;
      fetchingMoreRef.current = true;
      setLoadingMore(true);
    }

    try {
      const query: GetNutriSessionsQueryDTO = {
        limit: PAGE_LIMIT,
        cursor: reset ? undefined : cursorRef.current || undefined,
        search: searchRef.current || undefined,
        status: statusRef.current || undefined,
        type: typeRef.current || undefined,
        sortBy: sortRef.current,
      };

      const response = await nutriSessionService.getSessions(query);

      setSessions((prev) =>
        reset ? response.items : [...prev, ...response.items],
      );
      cursorRef.current = response.nextCursor;
      hasMoreRef.current = response.hasMore;
      setHasMore(response.hasMore);
    } catch {
      setError("We couldn't load your sessions. Please try again.");
      if (reset) {
        setSessions([]);
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } finally {
      if (reset) {
        resettingRef.current = false;
        setInitialLoading(false);
      } else {
        fetchingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, []);

  // Refetch from scratch whenever filters/sort/search change
  useEffect(() => {
    searchRef.current = debouncedSearch;
    statusRef.current = status;
    typeRef.current = type;
    sortRef.current = sortBy;

    cursorRef.current = null;
    hasMoreRef.current = true;
    skipRef.current = true; // prevent the observer from double-firing during reset
    fetchSessions(true).finally(() => {
      skipRef.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, type, sortBy]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !skipRef.current &&
          !fetchingMoreRef.current &&
          hasMoreRef.current
        ) {
          fetchSessions(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchSessions]);

  const showEmpty = !initialLoading && !error && sessions.length === 0;
  const showError = !initialLoading && error && sessions.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Sessions
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Create and manage your live and scheduled sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/nutritionist/sessions/create")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" />
          Create Session
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 sm:min-w-[220px]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="h-full w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as SessionType | "")}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 sm:w-44"
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SessionStatus | "")}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 sm:w-40"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as NutriSessionSortOption)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 sm:w-40"
        >
          {NUTRI_SESSION_SORT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {SORT_LABELS[o]}
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {showError && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100/80 text-rose-700">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">{error}</p>
          <button
            type="button"
            onClick={() => fetchSessions(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-emerald-800"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {showEmpty && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CalendarX2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No sessions found
          </p>
          <p className="max-w-sm text-xs font-medium text-slate-500">
            Try adjusting your search or filters, or create a new session to get
            started.
          </p>
        </div>
      )}

      {/* Initial loading skeletons */}
      {initialLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Session grid */}
      {!initialLoading && sessions.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.sessionId} session={session} />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel + trailing states */}
      {!initialLoading && sessions.length > 0 && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-4"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more sessions...
            </div>
          )}
          {!hasMore && !loadingMore && (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              You&apos;ve reached the end of the list
            </p>
          )}
          {error && !loadingMore && hasMore && (
            <button
              type="button"
              onClick={() => fetchSessions(false)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Retry loading more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
