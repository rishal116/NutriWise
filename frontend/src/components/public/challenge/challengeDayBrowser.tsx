"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PublicChallengeDayDTO } from "@/dtos/public/challenge/public-challenge-details.dto";

import { ChallengeDayCard } from "./challengeDayCard";

interface ChallengeDayBrowserProps {
  challengeId: string;
  days: PublicChallengeDayDTO[];
}

interface ChallengeWeek {
  weekNumber: number;
  days: PublicChallengeDayDTO[];
}

const DAYS_PER_PAGE = 7;

const PAGE_BUTTON_CLASSES =
  "inline-flex h-10 items-center gap-2 rounded-xl border border-[#D1FAE5] bg-white px-4 text-sm font-medium text-[#065F46] shadow-sm transition hover:bg-[#ECFDF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAF9] disabled:pointer-events-none disabled:opacity-40";

export function ChallengeDayBrowser({
  challengeId,
  days,
}: ChallengeDayBrowserProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedDays = useMemo(
    () => [...days].sort((a, b) => a.dayNumber - b.dayNumber),
    [days],
  );

  const totalPages = Math.ceil(sortedDays.length / DAYS_PER_PAGE);

  const activePage = Math.min(currentPage, Math.max(totalPages, 1));

  const visibleDays = useMemo(() => {
    const startIndex = (activePage - 1) * DAYS_PER_PAGE;

    return sortedDays.slice(startIndex, startIndex + DAYS_PER_PAGE);
  }, [sortedDays, activePage]);

  const weeks = useMemo<ChallengeWeek[]>(() => {
    const grouped = new Map<number, PublicChallengeDayDTO[]>();

    for (const day of visibleDays) {
      const weekNumber = Math.ceil(day.dayNumber / 7);
      const weekDays = grouped.get(weekNumber);

      if (weekDays) {
        weekDays.push(day);
      } else {
        grouped.set(weekNumber, [day]);
      }
    }

    return Array.from(grouped.entries()).map(([weekNumber, weekDays]) => ({
      weekNumber,
      days: weekDays,
    }));
  }, [visibleDays]);

  if (days.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-[#047857]/30 bg-[#ECFDF5] px-6 py-12 text-center">
        <div className="mx-auto max-w-md">
          <h2 className="text-lg font-semibold text-[#065F46]">
            Challenge days are coming soon
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            This challenge does not have any daily plans available yet.
          </p>
        </div>
      </section>
    );
  }

  const firstDay = (activePage - 1) * DAYS_PER_PAGE + 1;
  const lastDay = Math.min(activePage * DAYS_PER_PAGE, sortedDays.length);

  return (
    <section aria-labelledby="challenge-days-heading">
      {/* Section heading */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#047857]">
          Your journey
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="challenge-days-heading"
              className="text-2xl font-bold tracking-tight text-[#065F46] sm:text-3xl"
            >
              Challenge days
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Follow the plan one day at a time and open any day to explore its
              activities.
            </p>
          </div>

          <span className="rounded-full bg-[#D1FAE5] px-3 py-1.5 text-xs font-medium text-[#065F46]">
            {sortedDays.length} {sortedDays.length === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      {/* Weekly challenge days */}
      <div className="space-y-10">
        {weeks.map((week) => (
          <section
            key={week.weekNumber}
            aria-labelledby={`challenge-week-${week.weekNumber}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <h3
                id={`challenge-week-${week.weekNumber}`}
                className="text-base font-semibold text-[#065F46] sm:text-lg"
              >
                Week {week.weekNumber}
              </h3>

              <div className="h-px flex-1 bg-[#D1FAE5]" aria-hidden="true" />

              <span className="text-xs font-medium text-slate-600">
                {week.days.length} {week.days.length === 1 ? "day" : "days"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {week.days.map((day) => (
                <ChallengeDayCard
                  key={day.id}
                  challengeId={challengeId}
                  day={day}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Challenge days pagination"
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#D1FAE5] pt-6 sm:flex-row"
        >
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-medium text-[#065F46]">
              {firstDay}-{lastDay}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#065F46]">
              {sortedDays.length}
            </span>{" "}
            days
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={activePage === 1}
              className={PAGE_BUTTON_CLASSES}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>

            <span
              aria-live="polite"
              className="min-w-16 text-center text-sm font-medium text-slate-600"
            >
              {activePage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={activePage === totalPages}
              className={PAGE_BUTTON_CLASSES}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}