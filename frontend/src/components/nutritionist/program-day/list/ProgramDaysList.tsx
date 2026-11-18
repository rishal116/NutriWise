"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpDown } from "lucide-react";

import { nutriProgramDayService } from "@/services/nutritionist/nutri-program-day.service";
import { ProgramDaySortBy } from "@/dtos/nutritionist/program-day/nutri-program-day-list-query.dto";

import type { NutriProgramDayCardResponseDTO } from "@/dtos/nutritionist/program-day/nutri-program-day-card-response.dto";

import { ProgramDayCard } from "./ProgramDayCard";
import { ProgramDaysSkeleton } from "./ProgramDaysSkeleton";
import { ProgramDaysEmptyState } from "./ProgramDaysEmptyState";

interface ProgramDaysListProps {
  programId: string;
}

const LIMIT = 12;

export function ProgramDaysList({ programId }: ProgramDaysListProps) {
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

        cursorRef.current = null;
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
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchDays, hasMore, loading]);

  const handleSortChange = () => {
    setSortBy((previous) =>
      previous === ProgramDaySortBy.ASC
        ? ProgramDaySortBy.DESC
        : ProgramDaySortBy.ASC,
    );
  };

  const handleBack = () => {
    router.push(`/nutritionist/programs/${programId}`);
  };

  const handleDayClick = (dayId: string) => {
    router.push(`/nutritionist/programs/${programId}/days/${dayId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to program
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Program days
          </h1>

          <p className="text-sm text-slate-500">
            Activities scheduled for each day of this program.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSortChange}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:border-emerald-200 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowUpDown size={14} />

            {sortBy === ProgramDaySortBy.ASC
              ? "Day: Low–High"
              : "Day: High–Low"}
          </button>
        </div>

        {loading ? (
          <ProgramDaysSkeleton />
        ) : days.length === 0 ? (
          <ProgramDaysEmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {days.map((day) => (
                <ProgramDayCard
                  key={day.userProgramDayId}
                  day={day}
                  onClick={handleDayClick}
                />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {fetchingMore && <ProgramDaysSkeleton count={3} />}

            {!hasMore && (
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
