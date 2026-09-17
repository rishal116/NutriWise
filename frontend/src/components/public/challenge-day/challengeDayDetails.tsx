"use client";

import { useEffect, useState } from "react";

import { publicChallengeService } from "@/services/public/publicChallenge.service";

import type { PublicChallengeDayDetailsDTO } from "@/dtos/public/challenge-day/public-challenge-day-details.dto";

import { ChallengeDayHero } from "./challengeDayHero";

import { ChallengeActivityCard } from "./challengeActivityCard";

import { ChallengeDayDetailsSkeleton } from "./challengeDayDetailsSkeleton";

interface ChallengeDayDetailsProps {
  challengeId: string;
  dayId: string;
}

export function ChallengeDayDetails({
  challengeId,
  dayId,
}: ChallengeDayDetailsProps) {
  const [day, setDay] = useState<PublicChallengeDayDetailsDTO | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDay = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await publicChallengeService.getChallengeDayDetails(
          challengeId,
          dayId,
        );

        setDay(response.data);
      } catch {
        setError("Unable to load this challenge day right now.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDay();
  }, [challengeId, dayId]);

  if (loading) {
    return <ChallengeDayDetailsSkeleton />;
  }

  if (error || !day) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Challenge day unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error ?? "This challenge day could not be found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <ChallengeDayHero challengeId={challengeId} day={day} />

      <section className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Today&apos;s activities
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Complete your day
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Work through the activities below to complete this day of your
            challenge.
          </p>
        </div>

        {day.activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <h3 className="font-semibold text-foreground">
              No activities available
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              This day does not have any activities yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {day.activities
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((activity) => (
                <ChallengeActivityCard key={activity.id} activity={activity} />
              ))}
          </div>
        )}
      </section>
    </main>
  );
}
