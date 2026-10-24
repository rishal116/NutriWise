"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardList, Search } from "lucide-react";

import { userProgramService } from "@/services/user/user-program.service";
import {
  UserProgramSort,
  type ProgramStatus,
} from "@/dtos/user/program/user-program-request.dto";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import { ProgramCard } from "@/components/user/programs/ProgramCard";
import { ProgramCardSkeleton } from "@/components/user/programs/ProgramCardSkeleton";
import { ProgramFilters } from "@/components/user/programs/ProgramFilters";

const PAGE_LIMIT = 12;

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [programStatus, setProgramStatus] = useState<ProgramStatus | "all">(
    "all",
  );
  const [sort, setSort] = useState<UserProgramSort>(UserProgramSort.NEWEST);

  const debouncedSearch = useDebounce(search, 400);

  const hasActiveFilters =
    debouncedSearch.trim() !== "" || programStatus !== "all";

  const queryKey = useMemo(
    () => [
      "user-programs",
      { search: debouncedSearch.trim(), programStatus, sort },
    ],
    [debouncedSearch, programStatus, sort],
  );

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
        limit: PAGE_LIMIT,
        cursor: pageParam,
        search: debouncedSearch.trim() || undefined,
        programStatus: programStatus === "all" ? undefined : programStatus,
        sort,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to load programs");
      }

      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const programs = data?.pages.flatMap((page) => page.items) ?? [];

  const observerRef = useRef<IntersectionObserver | null>(null);

  const setSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            void fetchNextPage().catch(() => {
              toast.error("Failed to load more programs");
            });
          }
        },
        { rootMargin: "200px" },
      );

      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const handleReset = useCallback(() => {
    setSearch("");
    setProgramStatus("all");
    setSort(UserProgramSort.NEWEST);
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-emerald-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          My Programs
        </h1>
      </div>

      <ProgramFilters
        search={search}
        onSearchChange={setSearch}
        programStatus={programStatus}
        onProgramStatusChange={setProgramStatus}
        sort={sort}
        onSortChange={setSort}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-6">
        {isPending ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProgramCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <ClipboardList className="h-6 w-6 text-rose-700" />
            </div>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
              Couldn&apos;t load your programs
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Something went wrong. Please try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isRefetching}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefetching ? "Retrying..." : "Try again"}
            </button>
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              {hasActiveFilters ? (
                <Search className="h-6 w-6 text-emerald-600" />
              ) : (
                <ClipboardList className="h-6 w-6 text-emerald-600" />
              )}
            </div>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
              {hasActiveFilters
                ? "No programs match your filters"
                : "No purchased programs"}
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Purchase a nutrition program to begin your journey."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program._id} program={program} />
              ))}
            </div>

            {hasNextPage && <div ref={setSentinel} className="h-1" />}

            {isFetchingNextPage && (
              <div className="grid gap-6 pt-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ProgramCardSkeleton key={index} />
                ))}
              </div>
            )}

            {!hasNextPage && programs.length > 0 && (
              <p className="pt-8 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                You&apos;ve reached the end
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
