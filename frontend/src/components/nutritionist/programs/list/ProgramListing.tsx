"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { nutriProgramService } from "@/services/nutritionist/nutri-program.service";
import type { GetProgramsQueryDTO } from "@/dtos/nutritionist/program/nutri-program-request.dto";
import { ProgramSortBy, type ProgramStatusFilter } from "@/types/program.types";
import { useDebounce } from "@/hooks/common/debounce.hooks";

import { ProgramFiltersBar } from "@/components/nutritionist/programs/list/ProgramFiltersBar";
import { ProgramCard } from "@/components/nutritionist/programs/list/ProgramCard";
import { ProgramListingSkeleton } from "@/components/nutritionist/programs/list/ProgramListingSkeleton";
import { ProgramEmptyState } from "@/components/nutritionist/programs/list/ProgramEmptyState";
import { ProgramErrorState } from "@/components/nutritionist/programs/list/ProgramErrorState";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

export function ProgramListing() {
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

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["nutritionist-programs", filters],
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
          <ProgramListingSkeleton />
        ) : isError ? (
          <ProgramErrorState onRetry={() => void refetch()} />
        ) : programs.length === 0 ? (
          <ProgramEmptyState hasActiveFilters={hasActiveFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.userProgramId} program={program} />
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
            You&apos;ve reached the end of the list.
          </p>
        )}
      </div>
    </div>
  );
}
