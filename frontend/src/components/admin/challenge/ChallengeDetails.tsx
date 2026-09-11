"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Crown,
  Edit3,
  Gauge,
  Trash2,
  Sparkles,
  UserRound,
  Hash,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

import { adminChallengeService } from "@/services/admin/adminChallenge.service";

interface ChallengeDetailsProps {
  challengeId: string;
}

export default function ChallengeDetails({
  challengeId,
}: ChallengeDetailsProps) {
  const router = useRouter();

  const [challenge, setChallenge] = useState<AdminChallengeDetailsDTO | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await adminChallengeService.getChallengeDetails(challengeId);

        setChallenge(response.data);
      } catch (err) {
        console.error(err);

        setError("Failed to load challenge details.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  const handlePublish = async () => {
    try {
      setActionLoading(true);
      setError(null);

      const response =
        await adminChallengeService.publishChallenge(challengeId);

      setChallenge(response.data);
    } catch (err) {
      console.error(err);

      setError("Failed to publish challenge.");
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

      await adminChallengeService.deleteChallenge(challengeId);

      router.push("/admin/challenges");
    } catch (err) {
      console.error(err);

      setError("Failed to delete challenge.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <ChallengeDetailsSkeleton />;
  }

  if (!challenge) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Challenge not found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            The challenge may have been deleted or no longer exists.
          </p>

          <Link
            href="/admin/challenges"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/challenges"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Challenges
          </Link>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={challenge.status} />

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                  {challenge.category.replaceAll("_", " ")}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                  {challenge.difficulty}
                </span>

                {challenge.accessType === "premium" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    <Crown className="h-3 w-3" />
                    Premium
                  </span>
                )}

                {challenge.accessType === "free" && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Free
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {challenge.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                {challenge.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/challenges/${challenge.id}/edit`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Link>

              {challenge.status === "draft" && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />

                  {actionLoading ? "Publishing..." : "Publish"}
                </button>
              )}

              {challenge.status !== "published" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 font-semibold text-red-700 hover:text-red-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main Content */}
          <main className="space-y-6">
            {/* Thumbnail */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {challenge.thumbnailUrl ? (
                <div className="relative aspect-[16/7] w-full bg-slate-100">
                  <Image
                    src={challenge.thumbnailUrl}
                    alt={challenge.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/7] w-full items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-100">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm font-medium">
                      No thumbnail available
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Instructions */}
            {challenge.instructions && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Instructions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Guidance for participants completing this challenge.
                  </p>
                </div>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {challenge.instructions}
                </p>
              </section>
            )}

            {/* Challenge Overview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Challenge Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Key information about this challenge.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Duration"
                  value={`${challenge.durationDays} ${
                    challenge.durationDays === 1 ? "day" : "days"
                  }`}
                />

                <InfoCard
                  icon={<Gauge className="h-4 w-4" />}
                  label="Difficulty"
                  value={challenge.difficulty}
                  capitalize
                />

                <InfoCard
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Category"
                  value={challenge.category.replaceAll("_", " ")}
                  capitalize
                />

                <InfoCard
                  icon={<Crown className="h-4 w-4" />}
                  label="Access"
                  value={challenge.accessType}
                  capitalize
                />
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Status */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Status</h2>

              <div className="mt-5">
                <StatusBadge status={challenge.status} large />

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {challenge.status === "draft" &&
                    "This challenge is still being prepared and is not visible to participants."}

                  {challenge.status === "published" &&
                    "This challenge is currently published and available to participants."}

                  {challenge.status === "archived" &&
                    "This challenge has been archived and is no longer active."}
                </p>
              </div>
            </section>

            {/* Metadata */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Metadata</h2>

              <div className="mt-5 space-y-5">
                <InfoRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Challenge ID"
                  value={challenge.id}
                />

                <InfoRow
                  icon={<UserRound className="h-4 w-4" />}
                  label="Created By"
                  value={challenge.createdBy}
                />

                <InfoRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Created"
                  value={formatDate(challenge.createdAt)}
                />

                <InfoRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Last Updated"
                  value={formatDate(challenge.updatedAt)}
                />
              </div>
            </section>

            {/* Next Step */}
            <section className="rounded-2xl border border-teal-100 bg-teal-50/60 p-6">
              <h2 className="text-base font-semibold text-teal-950">
                Challenge Days
              </h2>

              <p className="mt-2 text-sm leading-6 text-teal-800/80">
                Configure the daily activities for this challenge after creating
                the challenge.
              </p>

              <Link
                href={`/admin/challenges/${challenge.id}/days`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Manage Challenge Days
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}

function InfoCard({ icon, label, value, capitalize = false }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-medium">{label}</span>
      </div>

      <p
        className={`mt-2 text-sm font-semibold text-slate-800 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className="mt-1 break-all text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  large = false,
}: {
  status: string;
  large?: boolean;
}) {
  const styles = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    archived: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const style =
    styles[status as keyof typeof styles] ??
    "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border capitalize ${
        large
          ? "px-3.5 py-1.5 text-sm font-semibold"
          : "px-3 py-1 text-xs font-semibold"
      } ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ChallengeDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="h-5 w-40 rounded bg-slate-200" />

        <div className="mt-6 h-5 w-72 rounded bg-slate-200" />

        <div className="mt-4 h-10 w-2/3 rounded bg-slate-200" />

        <div className="mt-3 h-5 w-full max-w-2xl rounded bg-slate-200" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="aspect-[16/7] rounded-2xl bg-slate-200" />

            <div className="rounded-2xl bg-white p-6">
              <div className="h-6 w-32 rounded bg-slate-200" />
              <div className="mt-5 space-y-3">
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6">
              <div className="h-6 w-40 rounded bg-slate-200" />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="h-20 rounded-xl bg-slate-200" />
                <div className="h-20 rounded-xl bg-slate-200" />
                <div className="h-20 rounded-xl bg-slate-200" />
                <div className="h-20 rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-40 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
            <div className="h-40 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
