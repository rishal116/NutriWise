"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import { Session } from "@/dtos/nutritionist/session.dto";
import {
  CalendarDays,
  Video,
  Users,
  Clock,
  ChevronRight,
  Plus,
  Loader2,
  Tag,
  Search,
  SlidersHorizontal,
  CalendarX,
  RefreshCw,
  Wifi,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortOrder = "asc" | "desc";
type FilterState = {
  search: string;
  status: string;
  type: string;
  sortOrder: SortOrder;
};

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; classes: string; dot: string }
> = {
  scheduled: {
    label: "Scheduled",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  live: {
    label: "Live",
    classes: "bg-rose-50 text-rose-700 border-rose-100",
    dot: "bg-rose-500 animate-ping",
  },
  ongoing: {
    label: "Live",
    classes: "bg-rose-50 text-rose-700 border-rose-100",
    dot: "bg-rose-500 animate-ping",
  },
  ended: {
    label: "Ended",
    classes: "bg-slate-50 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-50 text-red-500 border-red-100",
    dot: "bg-red-400",
  },
};

const getStatus = (status: string) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? {
    label: status,
    classes: "bg-slate-50 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  };

// ─── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-24 bg-slate-100 h-24 sm:h-auto" />
        <div className="flex-1 p-5 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-slate-100 rounded-lg" />
            <div className="h-5 w-16 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-5 w-2/3 bg-slate-100 rounded-lg" />
          <div className="h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-4 w-4/5 bg-slate-100 rounded-lg" />
          <div className="flex gap-4 pt-2">
            <div className="h-4 w-16 bg-slate-100 rounded" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({
  filtered,
  onReset,
}: {
  filtered: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <CalendarX size={28} className="text-slate-400" />
      </div>
      <h3 className="text-base font-bold text-slate-700 mb-1">
        {filtered ? "No sessions match your filters" : "No sessions yet"}
      </h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">
        {filtered
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Create your first video consultation session to get started."}
      </p>
      {filtered ? (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <RefreshCw size={14} />
          Reset filters
        </button>
      ) : null}
    </div>
  );
}

// ─── Error state ───────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <Wifi size={28} className="text-red-400" />
      </div>
      <h3 className="text-base font-bold text-slate-700 mb-1">
        Failed to load sessions
      </h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">
        Something went wrong while fetching your sessions. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  );
}

// ─── Session card ──────────────────────────────────────────────────────────────

function SessionCard({
  session,
  onClick,
}: {
  session: Session;
  onClick: () => void;
}) {
  const isFree = session.price === 0;
  const statusCfg = getStatus(session.status);
  const date = new Date(session.scheduledAt);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-200 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Date sidebar */}
        <div className="sm:w-24 bg-gradient-to-b from-slate-50 to-white border-b sm:border-b-0 sm:border-r border-slate-100 flex sm:flex-col items-center justify-center px-4 py-4 gap-3 sm:gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {date.toLocaleDateString(undefined, { month: "short" })}
          </span>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 leading-none">
            {date.getDate()}
          </span>
          <span className="text-[11px] font-bold text-emerald-600">
            {date.toLocaleDateString(undefined, { weekday: "short" })}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6">
          {/* Badges + price row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Status */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusCfg.classes}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>

              {/* Type */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                  isFree
                    ? "bg-sky-50 text-sky-700 border-sky-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}
              >
                <Tag size={10} />
                {isFree ? "Free" : "Paid"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100">
                <Video size={10} />
                Video
              </span>
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <p
                className={`text-xl font-black leading-none ${isFree ? "text-sky-600" : "text-slate-900"}`}
              >
                {isFree ? "FREE" : `$${session.price}`}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {isFree ? "Open" : "Entry fee"}
              </p>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1 line-clamp-1">
            {session.title}
          </h2>

          {/* Description */}
          {session.description && (
            <p className="text-[13px] text-slate-400 line-clamp-2 leading-relaxed mb-4">
              {session.description}
            </p>
          )}

          {/* Footer meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
              <Clock size={13} className="text-emerald-500" />
              {session.durationInMinutes} mins
            </span>

            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
              <CalendarDays size={13} className="text-emerald-500" />
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {session.maxParticipants && (
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
                <Users size={13} className="text-emerald-500" />
                {session.maxParticipants} capacity
              </span>
            )}

            <span className="ml-auto flex items-center gap-1 text-[12px] font-bold text-emerald-600 group-hover:gap-2 transition-all">
              Manage
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const INITIAL_FILTERS: FilterState = {
  search: "",
  status: "",
  type: "",
  sortOrder: "desc",
};

export default function MySessionsPage() {
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // Track latest filters in a ref so loadMore closure always sees fresh values
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchSessions = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return;
      setLoading(true);
      setError(false);
      try {
        const { search, status, type, sortOrder } = filtersRef.current;
        const res = await nutriSessionService.getMySessions({
          page: pageNum,
          limit: 10,
          search: search || undefined,
          status: status || undefined,
          type: type || undefined,
          sortOrder,
        });

        setSessions((prev) =>
          reset || pageNum === 1 ? res.data : [...prev, ...res.data],
        );
        setHasMore(res.pagination.hasMore);
        setPage(pageNum + 1);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [loading],
  );

  // Initial load
  useEffect(() => {
    setInitialLoading(true);
    setSessions([]);
    setPage(1);
    setHasMore(true);
    fetchSessions(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchSessions(page);
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, fetchSessions]);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const isFiltered =
    filters.search !== "" || filters.status !== "" || filters.type !== "";

  const activeFilterCount = [
    filters.search,
    filters.status,
    filters.type,
  ].filter(Boolean).length;

  return (
   <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sessions
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your upcoming video consultations.
          </p>
        </div>
        <button
          onClick={() => router.push("/nutritionist/session/create")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200/50 shrink-0"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create Session
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search sessions…"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              showFilters || activeFilterCount > 0
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-500 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="px-4 py-3 flex flex-wrap gap-3 items-center">
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) =>
                updateFilter("sortOrder", e.target.value as SortOrder)
              }
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all ml-auto"
              >
                <RefreshCw size={12} />
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {initialLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={() => fetchSessions(1, true)} />
      ) : sessions.length === 0 ? (
        <EmptyState filtered={isFiltered} onReset={resetFilters} />
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onClick={() => router.push(`/nutritionist/session/${s.id}`)}
            />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {/* Loading more indicator */}
          {loading && !initialLoading && (
            <div className="flex justify-center py-6">
              <Loader2 size={20} className="animate-spin text-emerald-500" />
            </div>
          )}

          {/* End of list */}
          {!hasMore && sessions.length > 0 && (
            <p className="text-center text-xs text-slate-400 font-medium py-4">
              You&apos;ve reached the end · {sessions.length}{" "}
              {sessions.length === 1 ? "session" : "sessions"} total
            </p>
          )}
        </div>
      )}
    </div>
  );
}
