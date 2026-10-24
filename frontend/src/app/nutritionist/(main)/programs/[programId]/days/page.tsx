"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpDown, ListChecks, Plus } from "lucide-react";

import { nutriProgramDayService } from "@/services/nutritionist/nutri-program-day.service";
import { ProgramDaySortBy } from "@/dtos/nutritionist/program/nutri-program-day-list-query.dto";

import type { NutriProgramDayCardResponseDTO } from "@/dtos/nutritionist/program/nutri-program-day-card-response.dto";

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

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">No days added yet</p>
      <p className="text-xs text-slate-400">
        Start building this program by adding its first day.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
      >
        <Plus size={14} />
        Add day
      </button>
    </div>
  );
}

export default function ProgramDaysPage() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();

  const [days, setDays] = useState<NutriProgramDayCardResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState<ProgramDaySortBy>(ProgramDaySortBy.ASC);

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);
  const fetchingMoreRef = useRef(false);
  const requestIdRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchDays = useCallback(
    async (reset: boolean) => {
      if (!programId) return;

      if (!reset && (fetchingMoreRef.current || !hasMoreRef.current)) {
        return;
      }

      const requestId = ++requestIdRef.current;

      if (reset) {
        cursorRef.current = null;
        hasMoreRef.current = false;
        fetchingMoreRef.current = false;
        setLoading(true);
        setFetchingMore(false);
      } else {
        fetchingMoreRef.current = true;
        setFetchingMore(true);
      }

      try {
        const response = await nutriProgramDayService.getProgramDays(
          programId,
          {
            cursor: reset ? undefined : (cursorRef.current ?? undefined),
            limit: LIMIT,
            sortBy,
          },
        );

        if (requestId !== requestIdRef.current) return;

        setDays((previous) =>
          reset ? response.items : [...previous, ...response.items],
        );

        cursorRef.current = response.nextCursor;
        hasMoreRef.current = response.hasMore;
        setHasMore(response.hasMore);
      } catch {
        if (requestId !== requestIdRef.current) return;

        if (reset) {
          setDays([]);
        }
        hasMoreRef.current = false;
        setHasMore(false);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setFetchingMore(false);
          fetchingMoreRef.current = false;
        }
      }
    },
    [programId, sortBy],
  );

  useEffect(() => {
    void fetchDays(true);

    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchDays]);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchDays(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchDays, hasMore, loading]);

  const goToCreate = () =>
    router.push(`/nutritionist/programs/${programId}/days/create`);

  const goToDay = (dayId: string) =>
    router.push(`/nutritionist/programs/${programId}/days/${dayId}`);

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
          <button
            type="button"
            onClick={() =>
              setSortBy((previous) =>
                previous === ProgramDaySortBy.ASC
                  ? ProgramDaySortBy.DESC
                  : ProgramDaySortBy.ASC,
              )
            }
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:border-emerald-200 hover:text-emerald-600"
          >
            <ArrowUpDown size={14} />
            {sortBy === ProgramDaySortBy.ASC
              ? "Day: Low–High"
              : "Day: High–Low"}
          </button>
        </div>

        {loading ? (
          <ListSkeleton />
        ) : days.length === 0 ? (
          <EmptyState onCreate={goToCreate} />
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
