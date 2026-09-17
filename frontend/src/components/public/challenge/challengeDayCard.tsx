import Link from "next/link";

import { ArrowRight, CalendarDays } from "lucide-react";

import type { PublicChallengeDayDTO } from "@/dtos/public/challenge/public-challenge-details.dto";

interface ChallengeDayCardProps {
  challengeId: string;
  day: PublicChallengeDayDTO;
}

export function ChallengeDayCard({ challengeId, day }: ChallengeDayCardProps) {
  return (
    <Link
      href={`/challenges/${challengeId}/days/${day.id}`}
      className="group block rounded-2xl border border-border bg-background p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`Open Day ${day.dayNumber}: ${
        day.title || `Challenge Day ${day.dayNumber}`
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {day.dayNumber}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Day {day.dayNumber}
          </p>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-foreground">
            {day.title || `Challenge Day ${day.dayNumber}`}
          </h3>

          {day.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
              {day.description}
            </p>
          )}
        </div>

        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          View day
        </span>

        <span className="text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Open
        </span>
      </div>
    </Link>
  );
}
