"use client";

import { useEffect, useState } from "react";

import { publicChallengeService } from "@/services/public/publicChallenge.service";

import type { PublicChallengeDetailsDTO } from "@/dtos/public/challenge/public-challenge-details.dto";

import { ChallengeDetailsHero } from "./ChallengeDetailsHero";
import { ChallengeDayBrowser } from "./challengeDayBrowser";
import { ChallengeDetailsSkeleton } from "./challengeDetailsSkeleton";

interface ChallengeDetailsProps {
  challengeId: string;
}

export function ChallengeDetails({ challengeId }: ChallengeDetailsProps) {
  const [challenge, setChallenge] = useState<PublicChallengeDetailsDTO | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await publicChallengeService.getChallengeDetails(challengeId);
          console.log(response);
          

        setChallenge(response.data);
      } catch {
        setError("Unable to load this challenge right now.");
      } finally {
        setLoading(false);
      }
    };

    void fetchChallenge();
  }, [challengeId]);

  if (loading) {
    return <ChallengeDetailsSkeleton />;
  }

  if (error || !challenge) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Challenge unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error ?? "This challenge could not be found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <ChallengeDetailsHero challenge={challenge} />

      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <ChallengeDayBrowser challengeId={challenge.id} days={challenge.days} />
      </div>
    </main>
  );
}
