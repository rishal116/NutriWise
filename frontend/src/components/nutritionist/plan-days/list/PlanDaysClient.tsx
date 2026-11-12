"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

import { nutritionistPlanDayService } from "@/services/nutritionist/nutri-plan-day.service";
import { NutritionistPlanDaySort } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";

import type { NutritionistPlanDayListItemDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";

import PlanDayFilters from "./PlanDayFilters";
import PlanDayList from "./PlanDayList";
import PlanDayListSkeleton from "./PlanDayListSkeleton";
import PlanDayEmptyState from "./PlanDayEmptyState";

interface PlanDaysClientProps {
  planId: string;
}

const LIMIT = 12;
const SEARCH_DEBOUNCE = 350;

export default function PlanDaysClient({ planId }: PlanDaysClientProps) {
  const router = useRouter();

  const [days, setDays] = useState<NutritionistPlanDayListItemDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dayNumber, setDayNumber] = useState("");

  const [sort, setSort] = useState<NutritionistPlanDaySort>(
    NutritionistPlanDaySort.DAY_ASC,
  );

  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(false);
  const fetchingMoreRef = useRef(false);
  const requestIdRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasFilters = Boolean(searchInput.trim() || dayNumber);

  // Debounce search input.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const fetchDays = useCallback(
    async (reset: boolean) => {
      if (!planId) return;

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

      const parsedDayNumber = Number(dayNumber);

      const validDayNumber =
        dayNumber.trim() !== "" &&
        Number.isInteger(parsedDayNumber) &&
        parsedDayNumber >= 1
          ? parsedDayNumber
          : undefined;

      try {
        const response = await nutritionistPlanDayService.getPlanDays(planId, {
          limit: LIMIT,
          cursor: reset ? undefined : (cursorRef.current ?? undefined),
          search: search || undefined,
          dayNumber: validDayNumber,
          sort,
        });

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
    [planId, search, dayNumber, sort],
  );

  // Fetch the first page whenever filters or sorting change.
  useEffect(() => {
    void fetchDays(true);

    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchDays]);

  // Infinite scrolling.
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

  const goToPlan = () => {
    router.push(`/nutritionist/plans/${planId}`);
  };

  const goToCreate = () => {
    router.push(`/nutritionist/plans/${planId}/days/create`);
  };

  const goToDay = (dayNumber: number) => {
    router.push(`/nutritionist/plans/${planId}/days/${dayNumber}`);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setDayNumber("");
    setSort(NutritionistPlanDaySort.DAY_ASC);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation */}
        <button
          type="button"
          onClick={goToPlan}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to plan
        </button>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Plan days
            </h1>

            <p className="text-sm text-slate-500">
              Manage activities scheduled for each day of this nutrition plan.
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

        {/* Filters */}
        <PlanDayFilters
          search={searchInput}
          dayNumber={dayNumber}
          sort={sort}
          onSearchChange={setSearchInput}
          onDayNumberChange={setDayNumber}
          onSortChange={setSort}
          onClear={clearFilters}
        />

        {/* Listing */}
        {loading ? (
          <PlanDayListSkeleton />
        ) : days.length === 0 ? (
          <PlanDayEmptyState
            hasFilters={hasFilters}
            onCreate={goToCreate}
            onClear={clearFilters}
          />
        ) : (
          <>
            <PlanDayList days={days} onDayClick={goToDay} />

            <div ref={sentinelRef} className="h-1" />

            {fetchingMore && <PlanDayListSkeleton count={3} />}

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
