"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, ListChecks, Search, ArrowUpDown } from "lucide-react";


import { nutriProgramDayService } from "@/services/nutritionist/nutriProgramDay.service";
import { ProgramDaySortBy } from "@/dtos/nutritionist/program/program-day-list-query.dto";
import {
  PROGRAM_ACTIVITY_CATEGORIES,
  type ProgramActivityCategory,
} from "@/dtos/nutritionist/program/program-day-response.dto";
import type { ProgramDayCardResponseDTO } from "@/dtos/nutritionist/program/program-day-card-response.dto";

const LIMIT = 12;

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onCreate,
}: {
  hasFilters: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">
        {hasFilters ? "No days match your filters" : "No days added yet"}
      </p>
      <p className="text-xs text-slate-400">
        {hasFilters
          ? "Try a different search term or category."
          : "Start building this program by adding its first day."}
      </p>
      {!hasFilters && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus size={14} />
          Add day
        </button>
      )}
    </div>
  );
}

export default function ProgramDaysPage() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();

  const [days, setDays] = useState<ProgramDayCardResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProgramActivityCategory | "">("");
  const [sortBy, setSortBy] = useState<ProgramDaySortBy>(ProgramDaySortBy.ASC);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);
  const fetchingMoreRef = useRef(false);
  const resettingRef = useRef(false);

  const searchRef = useRef(search);
  const categoryRef = useRef(category);
  const sortByRef = useRef(sortBy);

  // Guards against a stale (superseded) request committing state or
  // firing a toast after a newer request has already started.
  const requestIdRef = useRef(0);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);

  const fetchDays = useCallback(
    async (reset: boolean) => {
      if (!programId) return;

      if (!reset && (fetchingMoreRef.current || !hasMoreRef.current)) return;

      const currentRequestId = ++requestIdRef.current;

      if (reset) {
        resettingRef.current = true;
        cursorRef.current = null;
        hasMoreRef.current = false;
        setLoading(true);
      } else {
        fetchingMoreRef.current = true;
        setFetchingMore(true);
      }

      try {
        const res = await nutriProgramDayService.getProgramDays(programId, {
          cursor: reset ? undefined : (cursorRef.current ?? undefined),
          limit: LIMIT,
          search: searchRef.current || undefined,
          category: categoryRef.current || undefined,
          sortBy: sortByRef.current,
        });

        if (currentRequestId !== requestIdRef.current) return; // stale, ignore

        setDays((prev) => (reset ? res.items : [...prev, ...res.items]));
        cursorRef.current = res.nextCursor;
        hasMoreRef.current = res.hasMore;
        setHasMore(res.hasMore);
      } catch {
        if (currentRequestId !== requestIdRef.current) return; // stale, ignore

      } finally {
        if (currentRequestId !== requestIdRef.current) return; // stale, ignore

        if (reset) {
          resettingRef.current = false;
          setLoading(false);
        } else {
          fetchingMoreRef.current = false;
          setFetchingMore(false);
        }
      }
    },
    [programId],
  );

  // Initial load + reset whenever search/category/sort changes
  useEffect(() => {
    const delay = search ? 350 : 0;
    const timeout = setTimeout(() => fetchDays(true), delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId, search, category, sortBy]);

  // Infinite scroll trigger
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !resettingRef.current &&
          !fetchingMoreRef.current &&
          hasMoreRef.current
        ) {
          fetchDays(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchDays]);

  const goToCreate = () =>
    router.push(`/nutritionist/programs/${programId}/days/create`);

  const goToDay = (dayId: string) =>
    router.push(`/nutritionist/programs/${programId}/days/${dayId}`);

  const hasFilters = Boolean(search || category);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push(`/nutritionist/programs/${programId}`)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to program
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Program days
            </h1>
            <p className="text-sm text-slate-500">
              Activities scheduled for each day of this program.
            </p>
          </div>
          <button
            type="button"
            onClick={goToCreate}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 sm:self-auto"
          >
            <Plus size={14} />
            Add day
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search days..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-emerald-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as ProgramActivityCategory | "")
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-emerald-500 sm:w-44"
          >
            <option value="">All categories</option>
            {PROGRAM_ACTIVITY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              setSortBy((prev) =>
                prev === ProgramDaySortBy.ASC
                  ? ProgramDaySortBy.DESC
                  : ProgramDaySortBy.ASC,
              )
            }
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:border-emerald-200 hover:text-emerald-600"
          >
            <ArrowUpDown size={14} />
            {sortBy === ProgramDaySortBy.ASC
              ? "Day: Low-High"
              : "Day: High-Low"}
          </button>
        </div>

        {loading ? (
          <ListSkeleton />
        ) : days.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onCreate={goToCreate} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {days.map((day) => (
                <button
                  key={day.userProgramDayId}
                  type="button"
                  onClick={() => goToDay(day.userProgramDayId)}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
                >
                  <span className="text-sm font-bold text-slate-900">
                    Day {day.dayNumber}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <ListChecks size={14} className="text-slate-400" />
                    <span>
                      {day.activityCount}{" "}
                      {day.activityCount === 1 ? "activity" : "activities"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" />

            {fetchingMore && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            )}

            {!hasMore && !fetchingMore && (
              <p className="text-center text-xs font-medium text-slate-400">
                You&apos;ve reached the end.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
