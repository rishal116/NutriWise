"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import type { PublicChallengeDetailsDTO } from "@/dtos/public/challenge/public-challenge-details.dto";

import { publicChallengeService } from "@/services/public/publicChallenge.service";

interface StartChallengeButtonProps {
  challengeId: string;
  accessType: PublicChallengeDetailsDTO["accessType"];
  participation: PublicChallengeDetailsDTO["participation"];
}

export function StartChallengeButton({
  challengeId,
  accessType,
  participation,
}: StartChallengeButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const isPremium = accessType === "premium";

  const handleChallengeAction = async () => {
    if (loading) {
      return;
    }

    if (
      participation.status === "active" &&
      participation.userChallengeId
    ) {
      router.push(
        `/user/challenges/${participation.userChallengeId}`,
      );

      return;
    }

    if (participation.status !== "not_joined") {
      return;
    }

    try {
      setLoading(true);

      await publicChallengeService.joinChallenge(challengeId);

      const response =
        await publicChallengeService.getChallengeDetails(challengeId);

      const userChallengeId =
        response.data.participation.userChallengeId;

      if (!userChallengeId) {
        throw new Error(
          "User challenge ID was not returned after joining.",
        );
      }

      router.push(`/user/challenges/${userChallengeId}`);
    } finally {
      setLoading(false);
    }
  };

  if (participation.status === "completed") {
    return (
      <div className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary/10 px-5 py-3 text-sm font-semibold text-primary">
        <CheckCircle2 className="h-4 w-4" />
        Challenge completed
      </div>
    );
  }

  if (participation.status === "active") {
    return (
      <button
        type="button"
        onClick={handleChallengeAction}
        disabled={loading}
        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening...
          </>
        ) : (
          <>
            Continue Challenge
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleChallengeAction}
      disabled={loading}
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          {isPremium && <LockKeyhole className="h-4 w-4" />}

          <span>
            {isPremium
              ? "Start Premium Challenge"
              : "Start Challenge"}
          </span>

          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}