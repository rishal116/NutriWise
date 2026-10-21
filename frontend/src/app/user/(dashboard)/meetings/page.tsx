"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Video,
  Clock,
  ArrowRight,
  CheckCircle2,
  Inbox,
  RefreshCw,
  XCircle,
  Search,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";

import { userMeetingService } from "@/services/user/userMeeting.service";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import {
  MeetingStatus,
  MeetingSortBy,
  MeetingSortOrder,
} from "@/enums/user/meeting/user-meeting.enum";
import type { UserMeetingListQueryDTO } from "@/dtos/user/meeting/user-meeting-list-query.dto";
import type { UserMeetingListResponseDTO } from "@/dtos/user/meeting/user-meeting-list-response.dto";

const PAGE_LIMIT = 12;
const EARLY_JOIN_MS = 15 * 60 * 1000;

const STATUS_OPTIONS: {
  label: string;
  value: MeetingStatus | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: MeetingStatus.SCHEDULED },
  { label: "Ongoing", value: MeetingStatus.ONGOING },
  { label: "Completed", value: MeetingStatus.COMPLETED },
  { label: "Cancelled", value: MeetingStatus.CANCELLED },
];

const SORT_OPTIONS: {
  label: string;
  value: MeetingSortBy;
}[] = [
  { label: "Scheduled date", value: MeetingSortBy.SCHEDULED_AT },
  { label: "Created date", value: MeetingSortBy.CREATED_AT },
  { label: "Title", value: MeetingSortBy.TITLE },
];

function statusPillClasses(status: MeetingStatus): string {
  switch (status) {
    case MeetingStatus.ONGOING:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case MeetingStatus.SCHEDULED:
      return "bg-sky-50 text-sky-700 border-sky-200";
    case MeetingStatus.COMPLETED:
      return "bg-slate-100 text-slate-600 border-slate-200";
    case MeetingStatus.CANCELLED:
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function getInitial(fullName: string): string {
  return fullName.trim().charAt(0).toUpperCase() || "?";
}

function useJoinCountdown(scheduledAt: string, status: MeetingStatus) {
  const [now, setNow] = useState(() => Date.now());
  const target = new Date(scheduledAt).getTime();
  const diff = target - now;

  const fastTick =
    status === MeetingStatus.SCHEDULED && diff > 0 && diff < 3_600_000;

  useEffect(() => {
    const interval = setInterval(
      () => setNow(Date.now()),
      fastTick ? 1000 : 30_000,
    );

    return () => clearInterval(interval);
  }, [fastTick]);

  if (status === MeetingStatus.ONGOING) {
    return { label: "Join Live", canJoin: true };
  }

  if (status !== MeetingStatus.SCHEDULED) {
    return { label: "", canJoin: false };
  }

  if (diff <= 0) {
    return { label: "Join Session", canJoin: true };
  }

  const canJoin = diff <= EARLY_JOIN_MS;

  if (diff < 60_000) {
    return {
      label: `${Math.ceil(diff / 1000)}s`,
      canJoin,
    };
  }

  if (diff < 3_600_000) {
    const minutes = Math.floor(diff / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);

    return {
      label: `${minutes}m ${seconds}s`,
      canJoin,
    };
  }

  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);

  return {
    label: `${hours}h ${minutes}m`,
    canJoin,
  };
}

export default function UserMeetingsPage() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<UserMeetingListResponseDTO[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const [status, setStatus] = useState<MeetingStatus | "all">("all");

  const [sortBy, setSortBy] = useState<MeetingSortBy>(
    MeetingSortBy.SCHEDULED_AT,
  );
  const [sortOrder, setSortOrder] = useState<MeetingSortOrder>(
    MeetingSortOrder.ASC,
  );

  const searchRef = useRef(debouncedSearch);
  const statusRef = useRef(status);
  const sortByRef = useRef(sortBy);
  const sortOrderRef = useRef(sortOrder);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const fetchingMoreRef = useRef(false);
  const resettingRef = useRef(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    searchRef.current = debouncedSearch;
    statusRef.current = status;
    sortByRef.current = sortBy;
    sortOrderRef.current = sortOrder;
  }, [debouncedSearch, status, sortBy, sortOrder]);

  const buildQuery = useCallback(
    (cursor: string | null): UserMeetingListQueryDTO => {
      const query: UserMeetingListQueryDTO = {
        limit: PAGE_LIMIT,
        sortBy: sortByRef.current,
        sortOrder: sortOrderRef.current,
      };

      if (cursor) {
        query.cursor = cursor;
      }

      if (searchRef.current.trim()) {
        query.search = searchRef.current.trim();
      }

      if (statusRef.current !== "all") {
        query.status = statusRef.current;
      }

      return query;
    },
    [],
  );

  const fetchMeetings = useCallback(
    async (reset: boolean) => {
      if (reset) {
        if (resettingRef.current) return;

        resettingRef.current = true;
        fetchingMoreRef.current = true;
        cursorRef.current = null;
        hasMoreRef.current = true;

        setInitialLoading(true);
        setError(null);
      } else {
        if (fetchingMoreRef.current || !hasMoreRef.current) return;

        fetchingMoreRef.current = true;
        setLoadingMore(true);
      }

      try {
        const response = await userMeetingService.getMeetings(
          buildQuery(cursorRef.current),
        );

        const pagination = response.data;

        if (!pagination) {
          throw new Error("Meetings data is missing from the API response.");
        }

        const { items, nextCursor, hasMore } = pagination;

        setMeetings((previous) => (reset ? items : [...previous, ...items]));

        cursorRef.current = nextCursor;
        hasMoreRef.current = hasMore;
      } catch {
        setError("Couldn't load your sessions. Please try again.");

        if (reset) {
          setMeetings([]);
        }
      } finally {
        fetchingMoreRef.current = false;
        resettingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [buildQuery],
  );

  useEffect(() => {
    void fetchMeetings(true);
  }, [fetchMeetings, debouncedSearch, status, sortBy, sortOrder]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          hasMoreRef.current &&
          !fetchingMoreRef.current
        ) {
          void fetchMeetings(false);
        }
      },
      { rootMargin: "200px" },
    );

    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [fetchMeetings, meetings.length]);

  const markImageBroken = useCallback((id: string) => {
    setBrokenImageIds((previous) => {
      const next = new Set(previous);
      next.add(id);
      return next;
    });
  }, []);

  const isEmpty = !initialLoading && !error && meetings.length === 0;
  const activeFilterCount = status !== "all" ? 1 : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Meetings
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Track and join your nutrition consultations
          </p>
        </header>

        <section
          aria-label="Meeting filters"
          className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by title or nutritionist name"
                aria-label="Search meetings"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="hidden h-8 w-px bg-slate-200 lg:block" />

            {activeFilterCount > 0 && (
              <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {activeFilterCount} active filter
              </span>
            )}

            <div className="flex flex-wrap gap-3">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as MeetingStatus | "all")
                }
                aria-label="Filter by status"
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as MeetingSortBy)
                }
                aria-label="Sort meetings by"
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() =>
                  setSortOrder((previous) =>
                    previous === MeetingSortOrder.ASC
                      ? MeetingSortOrder.DESC
                      : MeetingSortOrder.ASC,
                  )
                }
                aria-label={`Sort ${
                  sortOrder === MeetingSortOrder.ASC
                    ? "ascending"
                    : "descending"
                }`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-emerald-500 hover:bg-white"
              >
                <ArrowUpDown
                  size={13}
                  aria-hidden="true"
                  className={
                    sortOrder === MeetingSortOrder.DESC
                      ? "rotate-180"
                      : undefined
                  }
                />
                {sortOrder === MeetingSortOrder.ASC
                  ? "Ascending"
                  : "Descending"}
              </button>
            </div>
          </div>
        </section>

        {initialLoading ? (
          <LoadingGrid />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => void fetchMeetings(true)}
          />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  router={router}
                  imageBroken={brokenImageIds.has(meeting.id)}
                  onImageError={() => markImageBroken(meeting.id)}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" />

            {loadingMore && (
              <div
                className="flex justify-center py-8"
                aria-label="Loading more meetings"
              >
                <RefreshCw
                  className="animate-spin text-emerald-600"
                  size={22}
                />
              </div>
            )}

            {!hasMoreRef.current && meetings.length > 0 && (
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

function MeetingCard({
  meeting,
  router,
  imageBroken,
  onImageError,
}: {
  meeting: UserMeetingListResponseDTO;
  router: ReturnType<typeof useRouter>;
  imageBroken: boolean;
  onImageError: () => void;
}) {
  const { label: countdownLabel, canJoin } = useJoinCountdown(
    meeting.scheduledAt,
    meeting.status,
  );

  const isOngoing = meeting.status === MeetingStatus.ONGOING;
  const isCancelled = meeting.status === MeetingStatus.CANCELLED;
  const isPast = meeting.status === MeetingStatus.COMPLETED || isCancelled;

  const dateObj = new Date(meeting.scheduledAt);
  const isValidDate = !Number.isNaN(dateObj.getTime());
  const profileImage = meeting.nutritionist.profileImage;
  const showImage = Boolean(profileImage) && !imageBroken;

  const goToDetails = () => router.push(`/user/meetings/${meeting.id}`);

  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all hover:shadow-lg ${
        isOngoing
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-slate-200/80 bg-white"
      }`}
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
            <Video size={18} aria-hidden="true" />
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${statusPillClasses(
              meeting.status,
            )} ${isOngoing ? "animate-pulse" : ""}`}
          >
            {meeting.status}
          </span>
        </div>

        <h2 className="mb-3 line-clamp-1 text-base font-bold text-slate-900">
          {meeting.title}
        </h2>

        <div className="mb-4 flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-100/80">
            {showImage ? (
              <Image
                src={profileImage as string}
                alt={meeting.nutritionist.fullName}
                fill
                sizes="32px"
                unoptimized
                className="object-cover"
                onError={onImageError}
              />
            ) : (
              <span className="text-xs font-bold text-emerald-700">
                {getInitial(meeting.nutritionist.fullName)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-800">
              {meeting.nutritionist.fullName}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {meeting.nutritionist.email}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Date
            </p>
            <p className="text-xs font-bold text-slate-700">
              {isValidDate
                ? dateObj.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Not available"}
            </p>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Time
            </p>
            <p className="text-xs font-bold text-slate-700">
              {isValidDate
                ? dateObj.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not available"}
            </p>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Minutes
            </p>
            <p className="text-xs font-bold text-emerald-700">
              {meeting.durationInMinutes}
            </p>
          </div>
        </div>

        {!isPast ? (
          <div className="space-y-1.5">
            {!canJoin && countdownLabel && (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
                <Clock
                  size={12}
                  aria-hidden="true"
                  className="shrink-0 text-emerald-600"
                />
                Starts in
                <span className="tabular-nums font-bold text-slate-800">
                  {countdownLabel}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={goToDetails}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                isOngoing
                  ? "bg-emerald-700 text-white shadow-xs hover:bg-emerald-800"
                  : "bg-slate-900 text-white shadow-xs hover:bg-emerald-700"
              }`}
            >
              {isOngoing
                ? "Join Live"
                : canJoin
                  ? "Join Session"
                  : "View Meeting"}
              <ArrowRight size={15} aria-hidden="true" />
            </button>

            {canJoin && !isOngoing && (
              <p className="text-center text-[10px] font-semibold text-emerald-700">
                The meeting room is open
              </p>
            )}
          </div>
        ) : (
          <div
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider ${
              isCancelled
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-slate-200 bg-slate-100 text-slate-500"
            }`}
          >
            {isCancelled ? (
              <XCircle size={13} aria-hidden="true" />
            ) : (
              <CheckCircle2 size={13} aria-hidden="true" />
            )}
            {isCancelled ? "Cancelled" : "Completed"}
          </div>
        )}

        {isCancelled && (
          <button
            type="button"
            onClick={goToDetails}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            View cancellation details
          </button>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
        <Inbox className="text-emerald-600" size={24} />
      </div>

      <h2 className="text-base font-bold text-slate-600">No meetings found</h2>

      <p className="mt-1 text-sm text-slate-400">
        Try adjusting your filters or search
      </p>
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
    <div className="rounded-2xl border border-slate-200/80 bg-white py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
        <AlertCircle className="text-rose-600" size={24} />
      </div>

      <h2 className="text-base font-bold text-slate-600">{message}</h2>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-800"
      >
        <RefreshCw size={14} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading meetings"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5"
        >
          <div className="mb-4 flex justify-between">
            <div className="h-11 w-11 rounded-xl bg-slate-200" />
            <div className="h-5 w-16 rounded-full bg-slate-200" />
          </div>

          <div className="mb-3 h-4 w-3/4 rounded bg-slate-200" />

          <div className="mb-4 flex items-center gap-2.5">
            <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-2/3 rounded bg-slate-200" />
              <div className="h-2.5 w-1/2 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mb-3 h-16 rounded-xl bg-slate-100" />
          <div className="h-11 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
