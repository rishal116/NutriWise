
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ChallengeForm from "@/components/admin/challenge/ChallengeForm";
import { adminChallengeService } from "@/services/admin/admin-challenge.service";
import type { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeEditClientProps {
  challengeId: string;
}

export default function ChallengeEditClient({
  challengeId,
}: ChallengeEditClientProps) {
  const router = useRouter();

  const [challenge, setChallenge] =
    useState<AdminChallengeDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchChallenge() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await adminChallengeService.getChallengeDetails(challengeId);

        if (!response.success || !response.data) {
          if (!cancelled) {
            setError(response.message || "Challenge not found.");
          }
          return;
        }

        if (!cancelled) {
          setChallenge(response.data);
        }
      } catch {
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
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="h-96 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !challenge) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/challenges"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Challenges
          </Link>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h1 className="text-xl font-semibold text-slate-900">
              Unable to load challenge
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {error ?? "Challenge not found."}
            </p>

            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Retry
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href={`/admin/challenges/${challengeId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Challenge
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Challenge
          </h1>
          <p className="mt-2 text-sm text-slate-500">
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
          }}
        />
      </div>
    </main>
  );
}
