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
      className="group block rounded-2xl border border-[#D1FAE5] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#047857]/40 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAF9]"
      aria-label={`Open Day ${day.dayNumber}: ${
        day.title || `Challenge Day ${day.dayNumber}`
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D1FAE5] text-sm font-bold text-[#065F46] transition-colors group-hover:bg-[#047857] group-hover:text-white">
          {day.dayNumber}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            Day {day.dayNumber}
          </p>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-[#065F46]">
            {day.title || `Challenge Day ${day.dayNumber}`}
          </h3>

          {day.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
              {day.description}
            </p>
          )}
        </div>

        <ArrowRight
          className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#047857] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#D1FAE5] pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <CalendarDays className="h-3.5 w-3.5 text-[#047857]" aria-hidden="true" />
          View day
        </span>

        <span
          aria-hidden="true"
          className="text-xs font-medium text-[#047857] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Open
        </span>
      </div>
    </Link>
  );
}