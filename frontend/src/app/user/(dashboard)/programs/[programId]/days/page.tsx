"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarCheck,
  ClipboardList,
  Dumbbell,
  Lock,
  Search,
} from "lucide-react";

import { userProgramDayService } from "@/services/user/user-program-day.service";
import type { UserProgramDayListDTO } from "@/dtos/user/program/user-program-day-list.dto";
import {
  UserDayTrackingStatus,
  UserProgramDaySort,
} from "@/dtos/user/program/user-program-day-list-query.dto";
import { useDebounce } from "@/hooks/common/debounce.hooks";

const PAGE_LIMIT = 12;

interface ProgramDaysPageProps {
  params: Promise<{
    programId: string;
  }>;
}

const STATUS_STYLES: Record<UserDayTrackingStatus, string> = {
  [UserDayTrackingStatus.NOT_STARTED]:
    "bg-slate-100 text-slate-700 border-slate-200",
  [UserDayTrackingStatus.IN_PROGRESS]:
    "bg-amber-50 text-amber-700 border-amber-200",
  [UserDayTrackingStatus.COMPLETED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  [UserDayTrackingStatus.MISSED]: "bg-rose-50 text-rose-700 border-rose-200",
  [UserDayTrackingStatus.SKIPPED]:
    "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<UserDayTrackingStatus, string> = {
  [UserDayTrackingStatus.NOT_STARTED]: "Not started",
  [UserDayTrackingStatus.IN_PROGRESS]: "In progress",
  [UserDayTrackingStatus.COMPLETED]: "Completed",
  [UserDayTrackingStatus.MISSED]: "Missed",
  [UserDayTrackingStatus.SKIPPED]: "Skipped",
};

const SORT_LABELS: Record<UserProgramDaySort, string> = {
  [UserProgramDaySort.DAY_ASC]: "Day (ascending)",
  [UserProgramDaySort.DAY_DESC]: "Day (descending)",
  [UserProgramDaySort.NEWEST]: "Newest first",
  [UserProgramDaySort.OLDEST]: "Oldest first",
};

export default function ProgramDaysPage({ params }: ProgramDaysPageProps) {
  const { programId } = use(params);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserDayTrackingStatus | "all">("all");
  const [locked, setLocked] = useState<"all" | "true" | "false">("all");
  const [sort, setSort] = useState<UserProgramDaySort>(
    UserProgramDaySort.DAY_ASC,
  );

  const debouncedSearch = useDebounce(search, 400);

  const hasActiveFilters =
    debouncedSearch !== "" || status !== "all" || locked !== "all";

  const queryKey = useMemo(
    () => [
      "user-program-days",
      programId,
      { search: debouncedSearch, status, locked, sort },
    ],
    [programId, debouncedSearch, status, locked, sort],
  );

  const {
    data,
    isPending,
    isError,
    refetch,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await userProgramDayService.browseProgramDays(
        programId,
        {
          limit: PAGE_LIMIT,
          cursor: pageParam,
          search: debouncedSearch || undefined,
          status: status === "all" ? undefined : status,
          locked: locked === "all" ? undefined : locked === "true",
          sort,
        },
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to load program days");
      }

      return response.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

  const days = data?.pages.flatMap((page) => page.items) ?? [];

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage || isFetchingNextPage || isFetchNextPageError) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage().catch(() => {
            toast.error("Failed to load more days");
          });
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  function handleReset() {
    setSearch("");
    setStatus("all");
    setLocked("all");
  }

  function handleLoadMore() {
    void fetchNextPage().catch(() => {
      toast.error("Failed to load more days");
    });
  }

  const selectClassName =
    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition-colors duration-150 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Link
        href={`/user/programs/${programId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Program
      </Link>

      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-emerald-600" />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Program Days
        </h1>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search days or activities..."
            aria-label="Search program days or activities"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs font-medium text-slate-700 transition-colors duration-150 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as UserDayTrackingStatus | "all")
            }
            className={selectClassName}
          >
            <option value="all">All statuses</option>
            {Object.values(UserDayTrackingStatus).map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by lock status"
            value={locked}
            onChange={(event) =>
              setLocked(event.target.value as "all" | "true" | "false")
            }
            className={selectClassName}
          >
            <option value="all">Locked & unlocked</option>
            <option value="false">Unlocked only</option>
            <option value="true">Locked only</option>
          </select>

          <select
            aria-label="Sort program days"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as UserProgramDaySort)
            }
            className={selectClassName}
          >
            {Object.values(UserProgramDaySort).map((value) => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {isPending ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <DayCardSkeleton key={index} />
            ))}
          </div>
        ) : isError && !data ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6 text-rose-700" />}
            iconBg="bg-rose-100"
            title="Couldn't load program days"
            description="Something went wrong while loading your program days."
          >
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Try again
            </button>
          </EmptyState>
        ) : days.length === 0 ? (
          <EmptyState
            icon={
              hasActiveFilters ? (
                <Search className="h-6 w-6 text-emerald-600" />
              ) : (
                <ClipboardList className="h-6 w-6 text-emerald-600" />
              )
            }
            title={
              hasActiveFilters
                ? "No days match your filters"
                : "No program days found"
            }
            description={
              hasActiveFilters
                ? "Try adjusting your search or filters."
                : "This program doesn't contain any days yet."
            }
          />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {days.map((day) => (
                <DayCard key={day._id} programId={programId} day={day} />
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {isFetchingNextPage && (
              <div className="grid gap-5 pt-5 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <DayCardSkeleton key={index} />
                ))}
              </div>
            )}

            {isFetchNextPageError && (
              <div className="flex flex-col items-center gap-3 pt-6">
                <p className="text-sm text-rose-600">
                  {" Couldn't load more days."}
                </p>
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Retry loading
                </button>
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
    </div>
  );
}

function DayCard({
  programId,
  day,
}: {
  programId: string;
  day: UserProgramDayListDTO;
}) {
  const completionPercentage = Math.min(
    100,
    Math.max(0, day.completionPercentage),
  );

  const cardBody = (
    <div
      className={`group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 ${
        day.isLocked
          ? "cursor-not-allowed opacity-60"
          : "hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700">
          Day {day.dayNumber}
        </h2>

        {day.isLocked ? (
          <span
            aria-label="Locked"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
          >
            <Lock className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[day.status]}`}
          >
            {STATUS_LABELS[day.status]}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-500">Progress</span>
          <span className="font-bold text-emerald-700">
            {completionPercentage}%
          </span>
        </div>

        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
            <Dumbbell className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Activities
            </p>
            <p className="text-sm font-bold text-slate-900">
              {day.completedActivities}/{day.totalActivities}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100/80 text-sky-700">
            <ClipboardList className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Required
            </p>
            <p className="text-sm font-bold text-slate-900">
              {day.requiredActivities}
            </p>
          </div>
        </div>
      </div>

      {day.isLocked ? (
        <div className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          Locked
        </div>
      ) : (
        <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 mt-5 text-center text-sm font-semibold text-white shadow-xs transition-all duration-150 group-hover:-translate-y-0.5 group-hover:bg-emerald-800 group-hover:shadow-lg">
          <CalendarCheck className="h-3.5 w-3.5" />
          View Day
        </div>
      )}
    </div>
  );

  if (day.isLocked) {
    return <div>{cardBody}</div>;
  }

  return (
    <Link
      href={`/user/programs/${programId}/days/${day.dayNumber}`}
      aria-label={`View day ${day.dayNumber}`}
    >
      {cardBody}
    </Link>
  );
}

function DayCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-14 animate-pulse rounded bg-slate-200" />
          <div className="h-2.5 w-8 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mt-1.5 h-2 w-full animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3">
        <div className="h-9 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-9 animate-pulse rounded-lg bg-slate-200" />
      </div>

      <div className="mt-5 h-9 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

function EmptyState({
  icon,
  iconBg = "bg-emerald-50",
  title,
  description,
  children,
}: {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 py-16 text-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>

      <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>

      {children}
    </div>
  );
}
