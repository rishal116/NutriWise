"use client";

import { useMemo, useRef } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { nutriProgramService } from "@/services/nutritionist/nutriProgram.service";
import {
  ProgramSortBy,
  ProgramStatusFilter,
  SubscriptionStatusFilter,
} from "@/dtos/nutritionist/program/program-request.dto";
import { useDebounce } from "@/hooks/common/debounce.hooks";
import { ProgramFiltersBar } from "@/components/nutritionist/programs/ProgramFiltersBar";
import { ProgramAvatar } from "@/components/nutritionist/programs/ProgramAvatar";
import {
  ProgramStatusBadge,
  SubscriptionStatusBadge,
} from "@/components/nutritionist/programs/StatusBadges";
import { ProgramStatsChips } from "@/components/nutritionist/programs/ProgramStatsChips";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProgressBar({
  completionPercentage,
  currentDay,
  durationDays,
}: {
  completionPercentage: number;
  currentDay: number;
  durationDays: number;
}) {
  const pct = Math.min(100, Math.max(0, completionPercentage));
  return (
    <div className="w-full min-w-[8rem]">
      <div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500">
        <span>
          Day {currentDay}/{durationDays}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">No programs found</p>
      <p className="text-xs text-slate-400">
        {hasActiveFilters
          ? "Try a different search term or filter."
          : "Client programs will show up here once created."}
      </p>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

export default function NutritionistProgramsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [programStatus, setProgramStatus] =
    useState<ProgramStatusFilter>("all");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatusFilter>("all");
  const [sortBy, setSortBy] = useState<ProgramSortBy>(ProgramSortBy.LATEST);

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const hasActiveFilters =
    debouncedSearch.trim() !== "" ||
    programStatus !== "all" ||
    subscriptionStatus !== "all";

  const queryKey = useMemo(
    () => [
      "nutritionist-programs",
      { search: debouncedSearch, programStatus, subscriptionStatus, sortBy },
    ],
    [debouncedSearch, programStatus, subscriptionStatus, sortBy],
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
    queryFn: async ({ pageParam }) =>
      nutriProgramService.getPrograms({
        limit: PAGE_SIZE,
        cursor: pageParam,
        search: debouncedSearch.trim() || undefined,
        programStatus,
        subscriptionStatus,
        sortBy,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const programs = data?.pages.flatMap((page) => page.items) ?? [];

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setSentinel = (node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    sentinelRef.current = node;
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage().catch(() => {
            toast.error("Couldn't load more programs.");
          });
        }
      },
      { rootMargin: "200px" },
    );
    observerRef.current.observe(node);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Programs
          </h1>
          <p className="text-sm text-slate-500">
            Browse and track every client program.
          </p>
        </div>

        <ProgramFiltersBar
          search={search}
          onSearchChange={setSearch}
          programStatus={programStatus}
          onProgramStatusChange={setProgramStatus}
          subscriptionStatus={subscriptionStatus}
          onSubscriptionStatusChange={setSubscriptionStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-700">
              Couldn&apos;t load programs
            </p>
            <p className="mt-1 text-xs text-slate-400">Please try again.</p>
          </div>
        ) : programs.length === 0 ? (
          <EmptyState hasActiveFilters={hasActiveFilters} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Client
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Dates
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {programs.map((program) => (
                    <tr
                      key={program.userProgramId}
                      onClick={() =>
                        router.push(
                          `/nutritionist/programs/${program.userProgramId}`,
                        )
                      }
                      className="cursor-pointer transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProgramAvatar
                            userProfileImage={program.userProfileImage}
                            userFullName={program.userFullName}
                          />
                          <div className="text-sm font-bold text-slate-900">
                            {program.userFullName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">
                          {program.planTitle}
                        </div>
                        <div className="text-xs text-slate-400">
                          {program.specialization}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <ProgramStatusBadge status={program.programStatus} />
                          <SubscriptionStatusBadge
                            status={program.subscriptionStatus}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ProgressBar
                          completionPercentage={program.completionPercentage}
                          currentDay={program.currentDay}
                          durationDays={program.durationDays}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <ProgramStatsChips
                          adherenceScore={program.adherenceScore}
                          currentStreak={program.currentStreak}
                          lastActivityAt={program.lastActivityAt}
                        />
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        <div>{formatDate(program.startDate)}</div>
                        <div>{formatDate(program.endDate)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {programs.map((program) => (
                <div
                  key={program.userProgramId}
                  onClick={() =>
                    router.push(
                      `/nutritionist/programs/${program.userProgramId}`,
                    )
                  }
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm active:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <ProgramAvatar
                      userProfileImage={program.userProfileImage}
                      userFullName={program.userFullName}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-900">
                        {program.userFullName}
                      </div>
                      <div className="truncate text-xs text-slate-400">
                        {program.specialization}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <ProgramStatusBadge status={program.programStatus} />
                    <SubscriptionStatusBadge
                      status={program.subscriptionStatus}
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {program.planTitle}
                  </p>

                  <div className="mt-3">
                    <ProgressBar
                      completionPercentage={program.completionPercentage}
                      currentDay={program.currentDay}
                      durationDays={program.durationDays}
                    />
                  </div>

                  <div className="mt-3">
                    <ProgramStatsChips
                      adherenceScore={program.adherenceScore}
                      currentStreak={program.currentStreak}
                      lastActivityAt={program.lastActivityAt}
                    />
                  </div>

                  <div className="mt-3 flex justify-between text-xs font-medium text-slate-500">
                    <span>{formatDate(program.startDate)}</span>
                    <span>{formatDate(program.endDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div ref={setSentinel} className="h-1" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-600" />
          </div>
        )}
        {!hasNextPage && programs.length > 0 && (
          <p className="py-2 text-center text-xs font-medium text-slate-400">
            You&apos;ve reached the end of the list.
          </p>
        )}
      </div>
    </div>
  );
}
