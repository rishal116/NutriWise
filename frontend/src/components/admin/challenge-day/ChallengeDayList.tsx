"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ListChecks, Plus } from "lucide-react";
import { toast } from "sonner";

import { adminChallengeDayService } from "@/services/admin/adminChallengeDay.service";
import type { AdminChallengeDayListItemDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-list-item.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

interface ChallengeDayListProps {
  challengeId: string;
  initialData: InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>;
}

const LIMIT = 12;

export default function ChallengeDayList({
  challengeId,
  initialData,
}: ChallengeDayListProps) {
  const [days, setDays] = useState<AdminChallengeDayListItemDTO[]>(
    initialData.items,
  );
  const [cursor, setCursor] = useState<string | null>(initialData.nextCursor);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const cursorRef = useRef(cursor);
  const hasMoreRef = useRef(hasMore);
  const fetchingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchMore = useCallback(async () => {
    if (fetchingMoreRef.current || !hasMoreRef.current) return;
    fetchingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const res = await adminChallengeDayService.listDays(challengeId, {
        limit: LIMIT,
        sortBy: "day_asc",
        cursor: cursorRef.current ?? undefined,
      });

      setDays((prev) => [...prev, ...res.data.items]);

      setCursor(res.data.nextCursor);
      setHasMore(res.data.hasMore);
    } catch {
      toast.error("Couldn't load more days. Try again.");
    } finally {
      fetchingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [challengeId]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMore]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader challengeId={challengeId} />

      {days.length === 0 ? (
        <EmptyState challengeId={challengeId} />
      ) : (
        <ul className="mt-6 space-y-3">
          {days.map((day) => (
            <DayCard key={day.id} challengeId={challengeId} day={day} />
          ))}
        </ul>
      )}

      <div ref={sentinelRef} className="h-1" />

      {isLoadingMore && (
        <ul className="mt-3 space-y-3">
          <SkeletonRow />
          <SkeletonRow />
        </ul>
      )}

      {!hasMore && days.length > 0 && (
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          All challenge days loaded
        </p>
      )}
    </div>
  );
}

function PageHeader({ challengeId }: { challengeId: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`/admin/challenges/${challengeId}`}
        className="inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 transition-colors duration-150 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to challenge
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Challenge Days
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage the days and activities included in this challenge.
          </p>
        </div>

        <Link
          href={`/admin/challenges/${challengeId}/days/create`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" />
          Add Day
        </Link>
      </div>
    </div>
  );
}

function DayCard({
  challengeId,
  day,
}: {
  challengeId: string;
  day: AdminChallengeDayListItemDTO;
}) {
  const createdDate = new Date(day.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <li>
      <Link
        href={`/admin/challenges/${challengeId}/days/${day.id}`}
        className="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-5"
      >
        <span className="flex shrink-0 items-center rounded-lg bg-emerald-50 px-3 py-2 text-xs sm:text-sm font-bold text-emerald-700">
          Day {day.dayNumber}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm sm:text-base font-semibold text-slate-900">
            {day.title || "Untitled day"}
          </h3>
          {day.description && (
            <p className="mt-0.5 line-clamp-1 text-xs sm:text-sm font-medium text-slate-500">
              {day.description}
            </p>
          )}
          <p className="mt-1.5 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-400">
            <ListChecks className="h-3.5 w-3.5" />
            {day.activityCount}{" "}
            {day.activityCount === 1 ? "Activity" : "Activities"}
            <span aria-hidden="true">·</span>
            {createdDate}
          </p>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-150 group-hover:translate-x-1 group-hover:text-emerald-600" />
      </Link>
    </li>
  );
}

function EmptyState({ challengeId }: { challengeId: string }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
        <ListChecks className="h-6 w-6 text-emerald-600" />
      </div>
      <p className="text-sm font-bold text-slate-700">No challenge days yet</p>
      <p className="max-w-xs text-xs sm:text-sm font-medium text-slate-500">
        Create the first day to start building out the schedule for this
        challenge.
      </p>
      <Link
        href={`/admin/challenges/${challengeId}/days/create`}
        className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800"
      >
        <Plus className="h-4 w-4" />
        Create First Day
      </Link>
    </div>
  );
}

function SkeletonRow() {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="h-8 w-16 shrink-0 animate-pulse rounded-lg bg-slate-200" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
      </div>
    </li>
  );
}
