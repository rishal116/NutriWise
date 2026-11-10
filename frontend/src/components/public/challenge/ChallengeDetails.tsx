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
  const [challenge, setChallenge] =
    useState<PublicChallengeDetailsDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchChallenge = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        setChallenge(null);

        const response =
          await publicChallengeService.getChallengeDetails(challengeId);

        if (!isMounted) return;

        if (!response.success || !response.data) {
          setError(response.message || "This challenge could not be found.");
          return;
        }

        setChallenge(response.data);
      } catch {
        if (!isMounted) return;
        setError("Unable to load this challenge right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchChallenge();

    return () => {
      isMounted = false;
    };
  }, [challengeId]);

  if (loading) {
    return <ChallengeDetailsSkeleton />;
  }

  if (error || !challenge) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAF9] px-4">
        <div
          role="alert"
          className="max-w-md rounded-2xl border border-[#D1FAE5] bg-white px-6 py-10 text-center shadow-sm"
        >
          <h1 className="text-xl font-semibold text-[#065F46]">
            Challenge unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error ?? "This challenge could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAF9]">
      <ChallengeDetailsHero challenge={challenge} />

      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <ChallengeDayBrowser
          challengeId={challenge.id}
          days={challenge.days}
        />
      </div>
    </div>
  );
}