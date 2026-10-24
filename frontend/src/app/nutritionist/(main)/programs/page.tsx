"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { nutriProgramService } from "@/services/nutritionist/nutri-program.service";
import type { GetProgramsQueryDTO } from "@/dtos/nutritionist/program/nutri-program-request.dto";
import { ProgramSortBy, type ProgramStatusFilter } from "@/types/program.types";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import { ProgramFiltersBar } from "@/components/nutritionist/programs/ProgramFiltersBar";
import { ProgramAvatar } from "@/components/nutritionist/programs/ProgramAvatar";
import { ProgramStatusBadge } from "@/components/nutritionist/programs/StatusBadges";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProgressBar({
  completionPercentage,
  durationDays,
}: {
  completionPercentage: number;
  durationDays: number;
}) {
  const percentage = Math.min(100, Math.max(0, completionPercentage));

  return (
    <div className="w-full">
      <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-slate-500">
        <span>{durationDays} days</span>
        <span>{Math.round(percentage)}%</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-xs">
      <p className="text-sm font-bold text-slate-700">No programs found</p>

      <p className="text-xs font-medium text-slate-400">
        {hasActiveFilters
          ? "Try a different search term or filter."
          : "Client programs will show up here once created."}
      </p>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  );
}

export default function NutritionistProgramsPage() {
  const [search, setSearch] = useState("");
  const [programStatus, setProgramStatus] =
    useState<ProgramStatusFilter>("all");
  const [sortBy, setSortBy] = useState<ProgramSortBy>(ProgramSortBy.LATEST);

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const normalizedSearch = debouncedSearch.trim();

  const hasActiveFilters = normalizedSearch !== "" || programStatus !== "all";

  const filters = useMemo<GetProgramsQueryDTO>(
    () => ({
      limit: PAGE_SIZE,
      search: normalizedSearch || undefined,
      programStatus,
      sortBy,
    }),
    [normalizedSearch, programStatus, sortBy],
  );

  const queryKey = useMemo(() => ["nutritionist-programs", filters], [filters]);

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      nutriProgramService.getPrograms({
        ...filters,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const programs = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage().catch(() => {
      toast.error("Couldn't load more programs.");
    });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 rounded-full bg-emerald-600" />

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Programs
            </h1>

            <p className="text-sm font-medium text-slate-500">
              Browse and track every client program.
            </p>
          </div>
        </div>

        <ProgramFiltersBar
          search={search}
          onSearchChange={setSearch}
          programStatus={programStatus}
          onProgramStatusChange={setProgramStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {isPending ? (
          <CardsSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-xs">
            <p className="text-sm font-bold text-slate-700">
              {"Couldn't load programs"}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              Please try again.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Try again
            </button>
          </div>
        ) : programs.length === 0 ? (
          <EmptyState hasActiveFilters={hasActiveFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <Link
                key={program.userProgramId}
                href={`/nutritionist/programs/${program.userProgramId}`}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                <div className="flex items-start gap-3">
                  <ProgramAvatar
                    userProfileImage={program.userProfileImage}
                    userFullName={program.userFullName}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-900">
                      {program.userFullName}
                    </div>

                    <div className="truncate text-xs font-medium text-slate-400">
                      {program.specialization}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <ProgramStatusBadge status={program.programStatus} />
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Plan
                  </div>

                  <div className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-800">
                    {program.planTitle}
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    completionPercentage={program.completionPercentage}
                    durationDays={program.durationDays}
                  />
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Start
                    </div>

                    <div className="text-xs font-medium text-slate-600">
                      {formatDate(program.startDate)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      End
                    </div>

                    <div className="text-xs font-medium text-slate-600">
                      {formatDate(program.endDate)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-1" />

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div
              role="status"
              aria-label="Loading more programs"
              className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-600"
            />
          </div>
        )}

        {!isPending && !isError && !hasNextPage && programs.length > 0 && (
          <p className="py-2 text-center text-xs font-medium text-slate-400">
            {" You've reached the end of the list."}
          </p>
        )}
      </div>
    </div>
  );
}
