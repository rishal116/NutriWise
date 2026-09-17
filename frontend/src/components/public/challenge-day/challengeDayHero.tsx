"use client";

import Link from "next/link";

import { ArrowLeft, CheckCircle2 } from "lucide-react";

import type { PublicChallengeDayDetailsDTO } from "@/dtos/public/challenge-day/public-challenge-day-details.dto";

interface ChallengeDayHeroProps {
  challengeId: string;
  day: PublicChallengeDayDetailsDTO;
}

export function ChallengeDayHero({ challengeId, day }: ChallengeDayHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/20">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Link
          href={`/challenges/${challengeId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to challenge
        </Link>

        <div className="mt-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Day {day.dayNumber}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {day.title || `Challenge Day ${day.dayNumber}`}
          </h1>

          {day.description && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {day.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
