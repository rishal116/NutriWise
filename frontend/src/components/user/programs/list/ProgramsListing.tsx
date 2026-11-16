"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { userProgramService } from "@/services/user/user-program.service";
import { useDebounce } from "@/hooks/common/debounce.hooks";

import {
  USER_PROGRAM_SORT,
  type UserProgramSort,
} from "@/constants/user/program/user-program-sort.constants";
import type { ProgramStatus } from "@/constants/user/program/program-status.constants";

import type { UserProgramListQuery } from "@/dtos/user/program/user-program-request.dto";

import { ProgramFilters } from "@/components/user/programs/list/ProgramFilters";

import { ProgramGrid } from "./ProgramGrid";
import { ProgramEmptyState } from "./ProgramEmptyState";
import { ProgramErrorState } from "./ProgramErrorState";
import { ProgramCardSkeleton } from "./ProgramCardSkeleton";
import { ProgramListSkeleton } from "./ProgramListSkeleton";

const PAGE_LIMIT = 12;

export function ProgramsListing() {
  const [search, setSearch] = useState("");
  const [programStatus, setProgramStatus] = useState<ProgramStatus | "all">(
    "all",
  );
  const [sort, setSort] = useState<UserProgramSort>(USER_PROGRAM_SORT.NEWEST);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const normalizedSearch = debouncedSearch.trim();

  const hasActiveFilters =
    normalizedSearch.length > 0 || programStatus !== "all";

  const query = useMemo<UserProgramListQuery>(
    () => ({
      limit: PAGE_LIMIT,
      search: normalizedSearch || undefined,
      programStatus: programStatus === "all" ? undefined : programStatus,
      sort,
    }),
    [normalizedSearch, programStatus, sort],
  );

  const queryKey = useMemo(() => ["user-programs", query], [query]);

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await userProgramService.browsePrograms({
        ...query,
        cursor: pageParam,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to load programs.");
      }

      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const programs = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const handleReset = useCallback(() => {
    setSearch("");
    setProgramStatus("all");
    setSort(USER_PROGRAM_SORT.NEWEST);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleStatusChange = useCallback((value: ProgramStatus | "all") => {
    setProgramStatus(value);
  }, []);

  const handleSortChange = useCallback((value: UserProgramSort) => {
    setSort(value);
  }, []);

  const handleFetchNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage().catch(() => {
      toast.error("Failed to load more programs.");
    });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          handleFetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleFetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <ProgramListSkeleton />;
  }

  if (isError) {
    return (
      <ProgramErrorState
        isRetrying={isRefetching}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div>
      <ProgramFilters
        search={search}
        onSearchChange={handleSearchChange}
        programStatus={programStatus}
        onProgramStatusChange={handleStatusChange}
        sort={sort}
        onSortChange={handleSortChange}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {programs.length === 0 ? (
        <ProgramEmptyState
          hasActiveFilters={hasActiveFilters}
          onReset={handleReset}
        />
      ) : (
        <>
          <ProgramGrid programs={programs} />

          {hasNextPage && (
            <div ref={sentinelRef} aria-hidden="true" className="h-1" />
          )}

          {isFetchingNextPage && (
            <div className="grid gap-6 pt-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ProgramCardSkeleton key={index} />
              ))}
            </div>
          )}

          {!hasNextPage && (
            <p className="pt-8 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              You&apos;ve reached the end
            </p>
          )}
        </>
      )}
    </div>
  );
}
