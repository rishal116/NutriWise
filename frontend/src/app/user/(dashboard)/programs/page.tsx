"use client";

import { useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { userProgramService } from "@/services/user/userProgram.service";
import {
  ProgramStatus,
  SubscriptionStatus,
  UserProgramSort,
} from "@/dtos/user/program/user-program-request.dto";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import { ProgramCard } from "@/components/user/programs/ProgramCard";
import { ProgramCardSkeleton } from "@/components/user/programs/rogramCardSkeleton";
import { ProgramFilters } from "@/components/user/programs/ProgramFilters";

const PAGE_LIMIT = 12;

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [programStatus, setProgramStatus] = useState<ProgramStatus | "all">(
    "all",
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    SubscriptionStatus | "all"
  >("all");
  const [sort, setSort] = useState<UserProgramSort>(UserProgramSort.NEWEST);

  const debouncedSearch = useDebounce(search, 400);

  const hasActiveFilters =
    debouncedSearch !== "" ||
    programStatus !== "all" ||
    subscriptionStatus !== "all";

  const queryKey = useMemo(
    () => [
      "user-programs",
      { search: debouncedSearch, programStatus, subscriptionStatus, sort },
    ],
    [debouncedSearch, programStatus, subscriptionStatus, sort],
  );

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await userProgramService.browsePrograms({
        limit: PAGE_LIMIT,
        cursor: pageParam,
        search: debouncedSearch || undefined,
        programStatus: programStatus === "all" ? undefined : programStatus,
        subscriptionStatus:
          subscriptionStatus === "all" ? undefined : subscriptionStatus,
        sort,
      });

      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const programs = data?.pages.flatMap((page) => page.items) ?? [];

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setSentinel = (node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    sentinelRef.current = node;

    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage().catch(() => {
            toast.error("Failed to load more programs");
          });
        }
      },
      { rootMargin: "200px" },
    );

    observerRef.current.observe(node);
  };

  function handleReset() {
    setSearch("");
    setProgramStatus("all");
    setSubscriptionStatus("all");
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">My Programs</h1>

      <ProgramFilters
        search={search}
        onSearchChange={setSearch}
        programStatus={programStatus}
        onProgramStatusChange={setProgramStatus}
        subscriptionStatus={subscriptionStatus}
        onSubscriptionStatusChange={setSubscriptionStatus}
        sort={sort}
        onSortChange={setSort}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProgramCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Couldn&apos;t load your programs
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Something went wrong. Please try again.
            </p>
          </div>
        ) : programs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {hasActiveFilters
                ? "No programs match your filters"
                : "No purchased programs"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Purchase a nutrition program to begin your journey."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program._id} program={program} />
              ))}
            </div>

            <div ref={setSentinel} className="h-1" />

            {isFetchingNextPage && (
              <div className="grid gap-6 pt-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ProgramCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!hasNextPage && programs.length > 0 && (
              <p className="pt-8 text-center text-sm text-slate-400">
                You&apos;ve reached the end.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
