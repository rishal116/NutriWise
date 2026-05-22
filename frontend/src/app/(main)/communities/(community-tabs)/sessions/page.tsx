"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { userSessionService } from "@/services/user/session.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Loader2,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Search,
  Radio,
  SlidersHorizontal,
  CalendarClock,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

export type Session = {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationInMinutes: number;
  type: "free" | "paid";
  price?: number;
  status: "scheduled" | "live";
  joinedUsersCount: number;
  maxParticipants?: number;
};

type Filter = "all" | "free" | "paid";
type SortOrder = "asc" | "desc";

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const isToday = new Date().toDateString() === d.toDateString();
  const isTomorrow =
    new Date(Date.now() + 86400000).toDateString() === d.toDateString();
  const label = isToday ? "Today" : isTomorrow ? "Tomorrow" : null;
  return { date, time, label };
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-slate-100" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-full" />
          </div>
          <div className="w-12 h-6 bg-slate-100 rounded-full shrink-0" />
        </div>
        <div className="space-y-2 border-y border-slate-50 py-3">
          <div className="h-3 bg-slate-100 rounded w-2/3" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="h-3 bg-slate-100 rounded w-2/5" />
        </div>
        <div className="h-10 bg-slate-100 rounded-xl w-full" />
      </div>
    </div>
  );
}

/* ─── Empty ──────────────────────────────────────────────────────────────────── */

function EmptyState({
  filtered,
  label,
}: {
  filtered: boolean;
  label: string;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-14 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
        <Video size={20} className="text-slate-400" />
      </div>
      <p className="text-sm font-bold text-slate-600">
        No {label.toLowerCase()} sessions
        {filtered ? " match your filters" : ""}
      </p>
      {filtered && (
        <p className="text-xs text-slate-400 mt-1">
          Try switching to &quot;All&quot; or clearing your search.
        </p>
      )}
    </div>
  );
}

/* ─── Session card ───────────────────────────────────────────────────────────── */

function SessionCard({
  session,
  loadingId,
  onView,
}: {
  session: Session;
  loadingId: string | null;
  onView: (id: string) => void;
}) {
  const { date, time, label } = formatDate(session.scheduledAt);
  const isBusy = loadingId === session.id;
  const isFree = session.type === "free";
  const isLive = session.status === "live";
  const spotsLeft =
    session.maxParticipants != null
      ? session.maxParticipants - session.joinedUsersCount
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-200 flex flex-col"
    >
      {/* accent bar */}
      <div
        className={`h-0.5 w-full ${
          isLive ? "bg-rose-500" : isFree ? "bg-emerald-500" : "bg-violet-500"
        }`}
      />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {label && (
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  {label}
                </span>
              )}
              {isLive && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
                  Live
                </span>
              )}
            </div>

            <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
              {session.title}
            </h2>

            {session.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {session.description}
              </p>
            )}
          </div>

          {/* Price badge */}
          <span
            className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${
              isFree
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-violet-50 text-violet-700 border-violet-100"
            }`}
          >
            {isFree ? (
              <>
                <Sparkles size={10} />
                Free
              </>
            ) : (
              <>
                <IndianRupee size={10} />
                {session.price}
              </>
            )}
          </span>
        </div>

        {/* Meta */}
        <div className="space-y-2 py-3 border-y border-slate-50">
          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <Calendar size={11} className="text-slate-400" />
            </div>
            {date}
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <Clock size={11} className="text-slate-400" />
            </div>
            {time} · {session.durationInMinutes} min
          </div>

          <div className="flex items-center gap-2.5 text-xs font-medium">
            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <Users size={11} className="text-slate-400" />
            </div>
            <span className="text-slate-500">
              {session.joinedUsersCount}
              {session.maxParticipants ? ` / ${session.maxParticipants}` : ""} joined
            </span>
            {spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
              <span className="ml-auto text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                {spotsLeft} left
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onView(session.id)}
          disabled={isBusy}
          className="group/btn w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-60 active:scale-[0.99] shadow-sm shadow-emerald-200/50"
        >
          {isBusy ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              View Session
              <ArrowRight
                size={13}
                className="group-hover/btn:translate-x-0.5 transition-transform"
              />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Section header ─────────────────────────────────────────────────────────── */

function SectionHeader({
  live,
  count,
}: {
  live?: boolean;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      {live ? (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <Radio size={14} className="text-rose-600" />
          <h3 className="text-sm font-bold text-slate-800">Live Now</h3>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CalendarClock size={14} className="text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800">Scheduled Sessions</h3>
        </div>
      )}
      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function SessionsPage() {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Keep refs fresh for observer closure
  const pageRef = useRef(page);
  pageRef.current = page;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const fetchingMoreRef = useRef(fetchingMore);
  fetchingMoreRef.current = fetchingMore;

  const fetchSessions = useCallback(
    async (reset = false) => {
      try {
        const currentPage = reset ? 1 : pageRef.current;
        if (reset) setLoading(true);
        else setFetchingMore(true);

        const res = await userSessionService.getPublicSessions({
          page: currentPage,
          limit: 9,
          type: filter === "all" ? undefined : filter,
          search,
          sortBy: "scheduledAt",
          sortOrder,
        });

        setSessions((prev) => (reset ? res.data : [...prev, ...res.data]));
        setHasMore(res.pagination.hasMore);
        setPage(currentPage + 1);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
        setFetchingMore(false);
      }
    },
    [filter, search, sortOrder],
  );

  // Re-fetch on filter/search/sort change
  useEffect(() => {
    setSessions([]);
    setPage(1);
    setHasMore(true);
    fetchSessions(true);
  }, [filter, search, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll
  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !fetchingMoreRef.current
        ) {
          fetchSessions(false);
        }
      },
      { threshold: 0.1 },
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [fetchSessions]);

  const handleView = (sessionId: string) => {
    setLoadingId(sessionId);
   router.push(`/communities/sessions/${sessionId}`);
  };

  const isFiltered = filter !== "all" || search.trim() !== "";

  const visible = useMemo(() => {
    return sessions.filter((s) => {
      const matchesFilter = filter === "all" || s.type === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        s.title.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [sessions, filter, search]);

  const liveSessions = visible.filter((s) => s.status === "live");
  const scheduledSessions = visible.filter((s) => s.status === "scheduled");
  const freeCount = sessions.filter((s) => s.type === "free").length;
  const paidCount = sessions.filter((s) => s.type === "paid").length;

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sessions
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Live workshops and expert-led wellness sessions.
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal size={13} className="text-slate-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="asc">Earliest first</option>
            <option value="desc">Latest first</option>
          </select>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search sessions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              <RefreshCw size={12} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 px-4 py-3">
          {(
            [
              { key: "all" as Filter, label: "All", count: sessions.length },
              { key: "free" as Filter, label: "Free", count: freeCount },
              { key: "paid" as Filter, label: "Paid", count: paidCount },
            ]
          ).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === key
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200"
              }`}
            >
              {label}
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  filter === key
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Live sessions ─────────────────────────────────────────────────────── */}

      {(loading || liveSessions.length > 0) && (
        <section className="space-y-4">
          <SectionHeader live count={liveSessions.length} />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                : liveSessions.length === 0
                ? <EmptyState filtered={isFiltered} label="live" />
                : liveSessions.map((s) => (
                    <SessionCard
                      key={s.id}
                      session={s}
                      loadingId={loadingId}
                      onView={handleView}
                    />
                  ))}
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      {/* ── Scheduled sessions ────────────────────────────────────────────────── */}

      <section className="space-y-4">
        <SectionHeader count={scheduledSessions.length} />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : scheduledSessions.length === 0
              ? <EmptyState filtered={isFiltered} label="scheduled" />
              : scheduledSessions.map((s) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    loadingId={loadingId}
                    onView={handleView}
                  />
                ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* Fetching more indicator */}
      {fetchingMore && (
        <div className="flex justify-center py-4">
          <Loader2 size={18} className="animate-spin text-emerald-500" />
        </div>
      )}

      {/* End of list */}
      {!hasMore && sessions.length > 0 && (
        <p className="text-center text-xs text-slate-400 font-medium py-2">
          You&apos;ve seen all {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}