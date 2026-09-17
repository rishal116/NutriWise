import Link from "next/link";

import {
  ArrowLeft,
  Crown,
  Edit3,
  Sparkles,
  Trash2,
} from "lucide-react";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeDetailsHeaderProps {
  challenge: AdminChallengeDetailsDTO;
  actionLoading: boolean;
  onPublish: () => void;
  onDelete: () => void;
}

export function ChallengeDetailsHeader({
  challenge,
  actionLoading,
  onPublish,
  onDelete,
}: ChallengeDetailsHeaderProps) {
  return (
    <header className="mb-6">
      <Link
        href="/admin/challenges"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Challenges
      </Link>

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={challenge.status} />

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
              {challenge.category.replaceAll(
                "_",
                " ",
              )}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
              {challenge.difficulty}
            </span>

            {challenge.accessType ===
              "premium" && (
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

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {challenge.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/challenges/${challenge.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Link>

          {challenge.status === "draft" && (
            <button
              type="button"
              onClick={onPublish}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />

              {actionLoading
                ? "Publishing..."
                : "Publish"}
            </button>
          )}

          {challenge.status !== "published" && (
            <button
              type="button"
              onClick={onDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    published:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    draft:
      "border-amber-200 bg-amber-50 text-amber-700",
    archived:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  const style =
    styles[status as keyof typeof styles] ??
    "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}