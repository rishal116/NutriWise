"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Video,
  ChevronRight,
  RefreshCw,
  Inbox,
  AlertCircle,
  Search,
  ArrowUpDown,
  Clock,
  CalendarDays,
  Timer,
  X,
} from "lucide-react";

import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import {
  MeetingStatus,
  MeetingSortBy,
  MeetingSortOrder,
} from "@/enums/nutritionist/meeting/meeting.enum";
import type { MeetingCardResponseDTO } from "@/dtos/nutritionist/meeting/meeting-card-response.dto";
import type { MeetingListQueryDTO } from "@/dtos/nutritionist/meeting/meeting-list-query.dto";

const PAGE_LIMIT = 12;

const STATUS_TABS: { label: string; value: MeetingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: MeetingStatus.SCHEDULED },
  { label: "Ongoing", value: MeetingStatus.ONGOING },
  { label: "Completed", value: MeetingStatus.COMPLETED },
  { label: "Cancelled", value: MeetingStatus.CANCELLED },
];

const SORT_OPTIONS: { label: string; value: MeetingSortBy }[] = [
  { label: "Scheduled date", value: MeetingSortBy.SCHEDULED_AT },
  { label: "Created date", value: MeetingSortBy.CREATED_AT },
  { label: "Title", value: MeetingSortBy.TITLE },
];

const STATUS_STYLES: Record<
  string,
  { pill: string; bar: string; dot: string }
> = {
  [MeetingStatus.ONGOING]: {
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
  },
  [MeetingStatus.SCHEDULED]: {
    pill: "bg-sky-50 text-sky-700 border-sky-200",
    bar: "bg-sky-500",
    dot: "bg-sky-500",
  },
  [MeetingStatus.COMPLETED]: {
    pill: "bg-slate-100 text-slate-600 border-slate-200",
    bar: "bg-slate-300",
    dot: "bg-slate-400",
  },
  [MeetingStatus.CANCELLED]: {
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    bar: "bg-rose-400",
    dot: "bg-rose-500",
  },
};

const FALLBACK_STATUS_STYLE = {
  pill: "bg-slate-100 text-slate-600 border-slate-200",
  bar: "bg-slate-200",
  dot: "bg-slate-400",
};

// Created once, reused for every card.
const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: string | null): string {
  const date = parseDate(value);
  return date ? DATE_FORMAT.format(date) : "Not set";
}

function formatTime(value?: string | null): string {
  const date = parseDate(value);
  return date ? TIME_FORMAT.format(date) : "--:--";
}

function formatDuration(minutes?: number | null): string {
  return typeof minutes === "number" && minutes > 0 ? `${minutes} min` : "—";
}

function getInitial(name?: string | null): string {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

export default function NutritionistMeetingsPage() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<MeetingCardResponseDTO[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(
    () => new Set(),
  );

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [status, setStatus] = useState<MeetingStatus | "all">("all");
  const [sortBy, setSortBy] = useState<MeetingSortBy>(
    MeetingSortBy.SCHEDULED_AT,
  );
  const [sortOrder, setSortOrder] = useState<MeetingSortOrder>(
    MeetingSortOrder.DESC,
  );

  const cursorRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);
  const fetchingMoreRef = useRef(false);
  const hasMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const buildQuery = useCallback(
    (cursor: string | null): MeetingListQueryDTO => {
      const query: MeetingListQueryDTO = {
        limit: PAGE_LIMIT,
        sortBy,
        sortOrder,
      };
      const search = debouncedSearch.trim();
      if (search) query.search = search;
      if (status !== "all") query.status = status;
      if (cursor) query.cursor = cursor;
      return query;
    },
    [debouncedSearch, status, sortBy, sortOrder],
  );

  const fetchMeetings = useCallback(
    async (reset: boolean) => {
      if (!reset && (fetchingMoreRef.current || !hasMoreRef.current)) return;

      const requestId = reset ? ++requestIdRef.current : requestIdRef.current;
      fetchingMoreRef.current = true;

      if (reset) {
        cursorRef.current = null;
        hasMoreRef.current = false;
        setInitialLoading(true);
        setLoadingMore(false);
        setHasMore(false);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const response = await nutriMeetingService.getMeetings(
          buildQuery(reset ? null : cursorRef.current),
        );
        if (requestId !== requestIdRef.current) return;

        // Fallback: missing/partial payload is treated as "no data", not a crash.
        const result = response?.data;
        const items = Array.isArray(result?.items) ? result.items : [];
        const nextCursor = result?.nextCursor ?? null;
        const moreAvailable = Boolean(result?.hasMore && nextCursor);

        setMeetings((previous) => {
          if (reset) return items;
          const existing = new Set(previous.map((m) => m.id));
          return [...previous, ...items.filter((m) => !existing.has(m.id))];
        });

        cursorRef.current = nextCursor;
        hasMoreRef.current = moreAvailable;
        setHasMore(moreAvailable);
      } catch {
        if (requestId !== requestIdRef.current) return;
        setError("Couldn't load your meetings. Please try again.");
        if (reset) setMeetings([]);
      } finally {
        if (requestId === requestIdRef.current) {
          fetchingMoreRef.current = false;
          setInitialLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [buildQuery],
  );

  useEffect(() => {
    void fetchMeetings(true);
    return () => {
      requestIdRef.current += 1;
      fetchingMoreRef.current = false;
    };
  }, [fetchMeetings]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || initialLoading || error || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchMeetings(false);
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [
    fetchMeetings,
    hasMore,
    initialLoading,
    loadingMore,
    error,
    meetings.length,
  ]);

  const handleView = useCallback(
    (id: string) => router.push(`/nutritionist/meetings/${id}`),
    [router],
  );

  const handleImageError = useCallback((id: string) => {
    setBrokenImageIds((previous) => {
      if (previous.has(id)) return previous;
      const next = new Set(previous);
      next.add(id);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setStatus("all");
    setSortBy(MeetingSortBy.SCHEDULED_AT);
    setSortOrder(MeetingSortOrder.DESC);
  }, []);

  const hasFilters = status !== "all" || debouncedSearch.trim().length > 0;
  const isEmpty = !initialLoading && !error && meetings.length === 0;
  const fullError = !initialLoading && error && meetings.length === 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50/60 via-slate-50 to-slate-50 pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        {/* Header */}
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Meetings
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage your scheduled and past consultations
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/nutritionist/meetings/create")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/10 transition-all hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Plus size={18} />
            Schedule Meeting
          </button>
        </header>

        {/* Toolbar */}
        <section
          aria-label="Filters"
          className="mb-8 space-y-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xs backdrop-blur"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by meeting title or client name"
                aria-label="Search meetings"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as MeetingSortBy)}
                aria-label="Sort meetings by"
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() =>
                  setSortOrder((p) =>
                    p === MeetingSortOrder.ASC
                      ? MeetingSortOrder.DESC
                      : MeetingSortOrder.ASC,
                  )
                }
                aria-label={`Sort order: ${
                  sortOrder === MeetingSortOrder.ASC
                    ? "ascending"
                    : "descending"
                }`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-500 hover:bg-white"
              >
                <ArrowUpDown
                  size={13}
                  className={`transition-transform ${
                    sortOrder === MeetingSortOrder.ASC ? "" : "rotate-180"
                  }`}
                />
                {sortOrder === MeetingSortOrder.ASC ? "Asc" : "Desc"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {STATUS_TABS.map((tab) => {
              const active = status === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatus(tab.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Content */}
        {initialLoading ? (
          <LoadingGrid />
        ) : fullError ? (
          <ErrorState
            message={error}
            onRetry={() => void fetchMeetings(true)}
          />
        ) : isEmpty ? (
          <EmptyState
            hasFilters={hasFilters}
            onClear={clearFilters}
            onCreate={() => router.push("/nutritionist/meetings/create")}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onView={handleView}
                  imageBroken={brokenImageIds.has(meeting.id)}
                  onImageError={handleImageError}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {loadingMore && (
              <div
                className="flex justify-center py-8"
                role="status"
                aria-label="Loading more meetings"
              >
                <RefreshCw
                  className="animate-spin text-emerald-600"
                  size={22}
                />
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center gap-3 py-8">
                <p className="text-sm font-medium text-rose-600">{error}</p>
                <button
                  type="button"
                  onClick={() => void fetchMeetings(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-500"
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
            )}

            {!hasMore && !error && meetings.length > 0 && (
              <p className="py-8 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                You&apos;ve reached the end
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface MeetingCardProps {
  meeting: MeetingCardResponseDTO;
  onView: (id: string) => void;
  imageBroken: boolean;
  onImageError: (id: string) => void;
}

const MeetingCard = memo(function MeetingCard({
  meeting,
  onView,
  imageBroken,
  onImageError,
}: MeetingCardProps) {
  // Fallbacks for any missing backend fields.
  const title = meeting.title?.trim() || "Untitled meeting";
  const fullName = meeting.user?.fullName?.trim() || "Unknown client";
  const email = meeting.user?.email?.trim() || "No email provided";
  const profileImage = meeting.user?.profileImage;
  const showImage = Boolean(profileImage) && !imageBroken;
  const styles = STATUS_STYLES[meeting.status] ?? FALLBACK_STATUS_STYLE;
  const statusLabel = meeting.status || "unknown";
  const isOngoing = meeting.status === MeetingStatus.ONGOING;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${styles.bar}`}
      />

      <div>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
            <Video size={18} />
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${styles.pill}`}
          >
            <span className="relative flex h-1.5 w-1.5">
              {isOngoing && (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${styles.dot}`}
                />
              )}
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${styles.dot}`}
              />
            </span>
            {statusLabel}
          </span>
        </div>

        <h2
          title={title}
          className="mb-3 line-clamp-1 text-base font-bold text-slate-900"
        >
          {title}
        </h2>

        <div className="mb-4 flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-100/80">
            {showImage ? (
              <Image
                src={profileImage as string}
                alt={fullName}
                fill
                sizes="36px"
                unoptimized
                className="object-cover"
                onError={() => onImageError(meeting.id)}
              />
            ) : (
              <span className="text-xs font-bold text-emerald-700">
                {getInitial(meeting.user?.fullName)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">
              {fullName}
            </p>
            <p className="truncate text-[11px] text-slate-400">{email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <dl className="grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200/80 bg-slate-50 py-2.5">
          <Meta icon={<CalendarDays size={11} />} label="Date">
            {formatDate(meeting.scheduledAt)}
          </Meta>
          <Meta icon={<Clock size={11} />} label="Time">
            {formatTime(meeting.scheduledAt)}
          </Meta>
          <Meta icon={<Timer size={11} />} label="Length" accent>
            {formatDuration(meeting.durationInMinutes)}
          </Meta>
        </dl>

        <button
          type="button"
          onClick={() => onView(meeting.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          View Details
          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </article>
  );
});

function Meta({
  icon,
  label,
  accent,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 px-2 text-center">
      <dt className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </dt>
      <dd
        className={`mt-0.5 truncate text-xs font-bold ${
          accent ? "text-emerald-700" : "text-slate-700"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading meetings"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5"
        >
          <div className="mb-4 flex justify-between">
            <div className="h-11 w-11 rounded-xl bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-200" />
          </div>
          <div className="mb-4 h-4 w-3/4 rounded bg-slate-200" />
          <div className="mb-4 flex items-center gap-2.5">
            <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-2/3 rounded bg-slate-200" />
              <div className="h-2.5 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
          <div className="mb-3 h-14 rounded-xl bg-slate-100" />
          <div className="h-11 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
  onCreate,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-20 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
        <Inbox className="text-emerald-600" size={26} />
      </div>
      <h3 className="text-base font-bold text-slate-700">No meetings found</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-slate-400">
        {hasFilters
          ? "Nothing matches your search or filters. Try adjusting them."
          : "You have no meetings yet. Schedule one to get started."}
      </p>
      <button
        type="button"
        onClick={hasFilters ? onClear : onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-800"
      >
        {hasFilters ? (
          "Clear filters"
        ) : (
          <>
            <Plus size={16} />
            Schedule Meeting
          </>
        )}
      </button>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-slate-200/80 bg-white px-4 py-20 text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 ring-8 ring-rose-50/50">
        <AlertCircle className="text-rose-600" size={26} />
      </div>
      <h3 className="text-base font-bold text-slate-700">{message}</h3>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-800"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
