import { useMemo } from "react";

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

export function ChallengeDayBrowser({
  challengeId,
  days,
}: ChallengeDayBrowserProps) {
  const weeks = useMemo<ChallengeWeek[]>(() => {
    const grouped = new Map<number, PublicChallengeDayDTO[]>();

    for (const day of days) {
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
  }, [days]);

  if (days.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-border bg-muted/10 px-6 py-12 text-center">
        <div className="mx-auto max-w-md">
          <h2 className="text-lg font-semibold text-foreground">
            Challenge days are coming soon
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This challenge does not have any daily plans available yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="challenge-days-heading">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Your journey
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="challenge-days-heading"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              Challenge days
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Follow the plan one day at a time and open any day to explore its
              activities.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {days.length} {days.length === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {weeks.map((week) => (
          <section
            key={week.weekNumber}
            aria-labelledby={`challenge-week-${week.weekNumber}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <h3
                id={`challenge-week-${week.weekNumber}`}
                className="text-base font-semibold text-foreground sm:text-lg"
              >
                Week {week.weekNumber}
              </h3>

              <div className="h-px flex-1 bg-border" aria-hidden="true" />

              <span className="text-xs font-medium text-muted-foreground">
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
    </section>
  );
}
