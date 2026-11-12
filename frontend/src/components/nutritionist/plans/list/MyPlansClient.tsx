"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {  Plus } from "lucide-react";

import useMyPlans from "@/hooks/nutritionist/plan/useMyPlans";
import PlanFilters from "@/components/nutritionist/plans/list/PlanFilters";
import PlanCard from "@/components/nutritionist/plans/list/PlanCard";
import PlanSkeleton from "@/components/nutritionist/plans/list/PlanSkeleton";
import PlanEmptyState from "@/components/nutritionist/plans/list/PlanEmptyState";

export default function MyPlansClient() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    plans,
    activeTab,
    search,
    specialization,
    sort,
    loading,
    loadingMore,
    hasMore,
    error,
    setActiveTab,
    setSearch,
    setSpecialization,
    setSort,
    loadMore,
    reload,
  } = useMyPlans();

  // plans.length re-attaches the observer after each page, so it fires again
  // if the sentinel is still in view (short pages / tall screens).
  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMore, loadMore, plans.length]);

  const hasFilters =
    search.trim().length > 0 || specialization !== "" || sort !== "newest";

  const showInitialError = !loading && Boolean(error) && plans.length === 0;
  const showEmpty = !loading && !error && plans.length === 0;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-end">
        <Link
          href="/nutritionist/plans/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" />
          New Plan
        </Link>
      </div>

      <PlanFilters
        activeTab={activeTab}
        search={search}
        specialization={specialization}
        sort={sort}
        planCount={plans.length}
        onTabChange={setActiveTab}
        onSearchChange={setSearch}
        onSpecializationChange={setSpecialization}
        onSortChange={setSort}
      />

      {showInitialError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={reload}
            className="font-semibold hover:text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {loading && <PlanSkeleton />}

      {showEmpty && (
        <PlanEmptyState activeTab={activeTab} hasFilters={hasFilters} />
      )}

      {!loading && plans.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {hasMore ? (
            <div
              ref={sentinelRef}
              className="flex min-h-12 items-center justify-center gap-3"
            >
              {loadingMore && (
                <Loader2
                  size={20}
                  role="status"
                  aria-label="Loading more plans"
                  className="animate-spin text-emerald-600"
                />
              )}

              {error && !loadingMore && (
                <>
                  <p role="alert" className="text-xs text-red-600">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Retry
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="py-4 text-center text-xs font-medium text-slate-400">
              You&apos;ve reached the end of your plans.
            </p>
          )}
        </>
      )}
    </div>
  );
}
