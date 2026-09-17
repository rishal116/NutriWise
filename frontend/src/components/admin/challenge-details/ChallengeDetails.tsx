"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

import { adminChallengeService } from "@/services/admin/adminChallenge.service";

import { ChallengeDetailsHeader } from "./ChallengeDetailsHeader";
import { ChallengeDetailsCover } from "./ChallengeDetailsCover";
import { ChallengeOverview } from "./ChallengeOverview";
import { ChallengeMetadata } from "./ChallengeMetadata";
import { ChallengeDaysSection } from "./ChallengeDaysSection";
import { ChallengeDetailsSkeleton } from "./ChallengeDetailsSkeleton";

interface ChallengeDetailsProps {
  challengeId: string;
}

export default function ChallengeDetails({
  challengeId,
}: ChallengeDetailsProps) {
  const router = useRouter();

  const [challenge, setChallenge] =
    useState<AdminChallengeDetailsDTO | null>(
      null,
    );

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await adminChallengeService.getChallengeDetails(
            challengeId,
          );

        setChallenge(response.data);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load challenge details.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchChallenge();
  }, [challengeId]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handlePublish = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const response =
        await adminChallengeService.publishChallenge(
          challengeId,
        );

      setChallenge(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to publish challenge.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this challenge?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      await adminChallengeService.deleteChallenge(
        challengeId,
      );

      router.push("/admin/challenges");
      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete challenge.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <ChallengeDetailsSkeleton />;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Challenge not found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The challenge may have been deleted
              or no longer exists.
            </p>

            <Link
              href="/admin/challenges"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <ChallengeDetailsHeader
          challenge={challenge}
          actionLoading={actionLoading}
          onPublish={handlePublish}
          onDelete={handleDelete}
        />

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="flex-1">
              {error}
            </span>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-red-700 hover:text-red-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        <main className="space-y-6">
          <ChallengeDetailsCover
            challenge={challenge}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <ChallengeOverview
                challenge={challenge}
              />

              {challenge.instructions && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Instructions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Guidance for participants
                      completing this challenge.
                    </p>
                  </div>

                  <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {challenge.instructions}
                  </p>
                </section>
              )}

              <ChallengeDaysSection
                challengeId={challenge.id}
              />
            </div>

            <ChallengeMetadata
              challenge={challenge}
            />
          </div>
        </main>
      </div>
    </div>
  );
}