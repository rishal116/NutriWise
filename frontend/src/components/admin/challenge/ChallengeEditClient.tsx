"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ChallengeForm from "@/components/admin/challenge/form/ChallengeForm";
import { adminChallengeService } from "@/services/admin/admin-challenge.service";
import type { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeEditClientProps {
  challengeId: string;
}

const backLinkClass =
  "inline-flex items-center gap-2 rounded-lg text-sm font-medium text-admin-muted transition-colors hover:text-admin-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

export default function ChallengeEditClient({
  challengeId,
}: ChallengeEditClientProps) {
  const router = useRouter();

  const [challenge, setChallenge] = useState<AdminChallengeDetailsDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchChallenge() {
      const startTime = performance.now();

      try {
        setLoading(true);
        setError(null);

        const response =
          await adminChallengeService.getChallengeDetails(challengeId);

        console.log(
          `Challenge API duration: ${(performance.now() - startTime).toFixed(
            2,
          )}ms`,
        );

        if (!response.success || !response.data) {
          if (!cancelled) {
            setError(response.message || "Challenge not found.");
          }
          return;
        }

        if (!cancelled) {
          setChallenge(response.data);
        }
      } catch (error) {
        console.error("Challenge fetch failed:", error);

        if (!cancelled) {
          setError("Failed to load challenge details. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchChallenge();

    return () => {
      cancelled = true;
    };
  }, [challengeId]);

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading challenge"
        className="mx-auto max-w-5xl animate-pulse space-y-4"
      >
        <div className="h-5 w-40 rounded bg-admin-border" />
        <div className="h-10 w-64 rounded bg-admin-border" />
        <div className="h-96 rounded-2xl border border-admin-border bg-admin-surface" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/challenges" className={backLinkClass}>
          <ArrowLeft className="h-4 w-4" />
          Back to Challenges
        </Link>

        <section className="mt-8 rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-sm shadow-admin-text/5">
          <h1 className="text-xl font-semibold text-admin-text">
            Unable to load challenge
          </h1>
          <p className="mt-2 text-sm text-admin-muted">
            {error ?? "Challenge not found."}
          </p>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 rounded-xl bg-admin-accent px-4 py-2 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60"
          >
            Retry
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link href={`/admin/challenges/${challengeId}`} className={backLinkClass}>
        <ArrowLeft className="h-4 w-4" />
        Back to Challenge
      </Link>

      <div className="mb-6 mt-6">
        <h1 className="text-2xl font-bold text-admin-text">Edit Challenge</h1>
        <p className="text-sm font-medium text-admin-muted">
          Update the details and configuration of this challenge.
        </p>
      </div>

      <ChallengeForm
        mode="edit"
        challengeId={challengeId}
        initialValues={{
          title: challenge.title,
          description: challenge.description,
          instructions: challenge.instructions,
          thumbnailUrl: challenge.thumbnailUrl,
          category: challenge.category,
          difficulty: challenge.difficulty,
          accessType: challenge.accessType,
          durationDays: challenge.durationDays,
          goals: challenge.goals,
          benefits: challenge.benefits,
          tags: challenge.tags,
        }}
      />
    </div>
  );
}
