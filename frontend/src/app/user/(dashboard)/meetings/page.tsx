"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Video,
  Mic,
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
  MeetingType,
  MeetingSortBy,
  MeetingSortOrder,
} from "@/enums/user/meeting/user-meeting.enum";
import type { UserMeetingListQueryDTO } from "@/dtos/user/meeting/user-meeting-list-query.dto";
import type { UserMeetingListResponseDTO } from "@/dtos/user/meeting/user-meeting-list-response.dto";

const PAGE_LIMIT = 12;
const EARLY_JOIN_MS = 15 * 60 * 1000; // client can join 15 min before scheduled time

const STATUS_OPTIONS: { label: string; value: MeetingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: MeetingStatus.SCHEDULED },
  { label: "Ongoing", value: MeetingStatus.ONGOING },
  { label: "Completed", value: MeetingStatus.COMPLETED },
  { label: "Cancelled", value: MeetingStatus.CANCELLED },
];

const TYPE_OPTIONS: { label: string; value: MeetingType | "all" }[] = [
  { label: "All types", value: "all" },
  { label: "Video", value: MeetingType.VIDEO },
  { label: "Audio", value: MeetingType.AUDIO },
];

const SORT_OPTIONS: { label: string; value: MeetingSortBy }[] = [
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

/* Countdown to join-window opening. Ticks every second under an hour away,
   every 30s otherwise, to avoid needless re-renders on far-out sessions. */
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

  if (diff <= 0) return { label: "Join Session", canJoin: true };
  const canJoin = diff <= EARLY_JOIN_MS;

  if (diff < 60_000) {
    return { label: `${Math.ceil(diff / 1000)}s`, canJoin };
  }
  if (diff < 3_600_000) {
    const m = Math.floor(diff / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return { label: `${m}m ${s}s`, canJoin };
  }
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return { label: `${h}h ${m}m`, canJoin };
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
  const [type, setType] = useState<MeetingType | "all">("all");
  const [sortBy, setSortBy] = useState<MeetingSortBy>(
    MeetingSortBy.SCHEDULED_AT,
  );
  const [sortOrder, setSortOrder] = useState<MeetingSortOrder>(
    MeetingSortOrder.ASC, // default ascending — nearest upcoming session first
  );

  // Refs mirroring current filter state so the IntersectionObserver
  // callback never closes over stale values.
  const searchRef = useRef(debouncedSearch);
  const statusRef = useRef(status);
  const typeRef = useRef(type);
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
    typeRef.current = type;
    sortByRef.current = sortBy;
    sortOrderRef.current = sortOrder;
  }, [debouncedSearch, status, type, sortBy, sortOrder]);

  const buildQuery = useCallback(
    (cursor: string | null): UserMeetingListQueryDTO => {
      const query: UserMeetingListQueryDTO = {
        limit: PAGE_LIMIT,
        sortBy: sortByRef.current,
        sortOrder: sortOrderRef.current,
      };
      if (cursor) query.cursor = cursor;
      if (searchRef.current.trim()) query.search = searchRef.current.trim();
      if (statusRef.current !== "all") query.status = statusRef.current;
      if (typeRef.current !== "all") query.type = typeRef.current;
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
        const res = await userMeetingService.getMeetings(
          buildQuery(cursorRef.current),
        );
        const { items, nextCursor, hasMore } = res.data;

        setMeetings((prev) => (reset ? items : [...prev, ...items]));
        cursorRef.current = nextCursor;
        hasMoreRef.current = hasMore;
      } catch {
        setError("Couldn't load your sessions. Please try again.");
        if (reset) setMeetings([]);
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
    fetchMeetings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, type, sortBy, sortOrder]);

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
          fetchMeetings(false);
        }
      },
      { rootMargin: "200px" },
    );
    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [fetchMeetings, meetings.length]);

  const markImageBroken = (id: string) => {
    setBrokenImageIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const isEmpty = !initialLoading && !error && meetings.length === 0;
  const activeFilterCount =
    (status !== "all" ? 1 : 0) + (type !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Sessions
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track and join your nutrition consultations
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title or nutritionist name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="hidden lg:block h-8 w-px bg-slate-200" />

            {activeFilterCount > 0 && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0">
                {activeFilterCount} active
              </span>
            )}

            <div className="flex flex-wrap gap-3">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as MeetingStatus | "all")
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value as MeetingType | "all")}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as MeetingSortBy)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  setSortOrder((prev) =>
                    prev === MeetingSortOrder.ASC
                      ? MeetingSortOrder.DESC
                      : MeetingSortOrder.ASC,
                  )
                }
                aria-label={`Sort ${
                  sortOrder === MeetingSortOrder.ASC
                    ? "ascending"
                    : "descending"
                }`}
                className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-white hover:border-emerald-500 transition-all"
              >
                <ArrowUpDown
                  size={13}
                  className={
                    sortOrder === MeetingSortOrder.ASC ? "" : "rotate-180"
                  }
                />
                {sortOrder === MeetingSortOrder.ASC
                  ? "Ascending"
                  : "Descending"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {initialLoading ? (
          <LoadingGrid />
        ) : error ? (
          <ErrorState onRetry={() => fetchMeetings(true)} message={error} />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {meetings.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  router={router}
                  imageBroken={brokenImageIds.has(m.id)}
                  onImageError={() => markImageBroken(m.id)}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" />

            {loadingMore && (
              <div className="flex justify-center py-8">
                <RefreshCw
                  className="animate-spin text-emerald-600"
                  size={22}
                />
              </div>
            )}

            {!hasMoreRef.current && meetings.length > 0 && (
              <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-8">
                {"You've reached the end"}
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
  const isPast =
    meeting.status === MeetingStatus.COMPLETED ||
    meeting.status === MeetingStatus.CANCELLED;
  const isCancelled = meeting.status === MeetingStatus.CANCELLED;
  const dateObj = new Date(meeting.scheduledAt);
  const showImage = meeting.nutritionist.profileImage && !imageBroken;
  const TypeIcon = meeting.type === MeetingType.VIDEO ? Video : Mic;

  const goToDetails = () => router.push(`/user/meetings/${meeting.id}`);

  return (
    <div
      className={`group rounded-2xl border p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${
        isOngoing
          ? "bg-emerald-50/60 border-emerald-200"
          : "bg-white border-slate-200/80"
      }`}
    >
      <div>
        {/* TYPE ICON + STATUS */}
        <div className="flex justify-between items-start mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              meeting.type === MeetingType.VIDEO
                ? "bg-emerald-100/80 text-emerald-700"
                : "bg-sky-100/80 text-sky-700"
            }`}
          >
            <TypeIcon size={18} />
          </div>
          <span
            className={`text-[11px] font-semibold px-3 py-1 rounded-full border capitalize ${statusPillClasses(
              meeting.status,
            )} ${isOngoing ? "animate-pulse" : ""}`}
          >
            {meeting.status}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="font-bold text-base text-slate-900 mb-3 line-clamp-1">
          {meeting.title}
        </h3>

        {/* NUTRITIONIST */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-emerald-100/80 flex items-center justify-center border border-emerald-100">
            {showImage ? (
              <Image
                src={meeting.nutritionist.profileImage as string}
                alt={meeting.nutritionist.fullName}
                fill
                sizes="32px"
                unoptimized
                className="object-cover"
                onError={onImageError}
              />
            ) : (
              <span className="text-emerald-700 font-bold text-xs">
                {getInitial(meeting.nutritionist.fullName)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {meeting.nutritionist.fullName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {meeting.nutritionist.email}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* DATE / TIME / DURATION STRIP */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Date
            </p>
            <p className="text-xs font-bold text-slate-700">
              {dateObj.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Time
            </p>
            <p className="text-xs font-bold text-slate-700">
              {dateObj.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Mins
            </p>
            <p className="text-xs font-bold text-emerald-700">
              {meeting.durationInMinutes}
            </p>
          </div>
        </div>

        {/* ACTION */}
        {!isPast ? (
          <div className="space-y-1.5">
            {!canJoin && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                <Clock size={12} className="text-emerald-600 shrink-0" />
                Starts in&nbsp;
                <span className="font-bold text-slate-800 tabular-nums">
                  {countdownLabel}
                </span>
              </div>
            )}

            <button
              onClick={goToDetails}
              className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                isOngoing
                  ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                  : "bg-slate-900 hover:bg-emerald-700 text-white shadow-xs"
              }`}
            >
              {isOngoing ? "Join Live" : "View Session"}
              <ArrowRight size={15} />
            </button>

            {canJoin && !isOngoing && (
              <p className="text-[10px] text-emerald-700 font-semibold text-center">
                Room is open — session starts soon
              </p>
            )}
          </div>
        ) : (
          <div
            className={`w-full inline-flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl border ${
              isCancelled
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}
          >
            {isCancelled ? (
              <XCircle size={13} className="shrink-0" />
            ) : (
              <CheckCircle2 size={13} className="shrink-0" />
            )}
            {isCancelled ? "Cancelled" : "Completed"}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl py-20 text-center border border-dashed border-slate-300">
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
        <Inbox className="text-emerald-600" size={24} />
      </div>
      <h3 className="text-base font-bold text-slate-600">No sessions found</h3>
      <p className="text-sm text-slate-400 mt-1">
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
    <div className="bg-white rounded-2xl py-20 text-center border border-slate-200/80">
      <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="text-rose-600" size={24} />
      </div>
      <h3 className="text-base font-bold text-slate-600">{message}</h3>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 h-64 animate-pulse"
        >
          <div className="flex justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-slate-200" />
            <div className="w-16 h-5 rounded-full bg-slate-200" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-2/3" />
              <div className="h-2.5 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-16 bg-slate-100 rounded-xl mb-3" />
          <div className="h-11 bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
