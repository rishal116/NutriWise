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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

const chipClass =
  "rounded-full bg-admin-bg px-3 py-1 text-xs font-medium capitalize text-admin-muted";

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
        className={`inline-flex items-center gap-2 rounded-lg text-sm font-medium text-admin-muted transition-colors hover:text-admin-accent ${focusRing}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Challenges
      </Link>

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={challenge.status} />

            <span className={chipClass}>
              {challenge.category.replaceAll("_", " ")}
            </span>

            <span className={chipClass}>{challenge.difficulty}</span>

            {challenge.accessType === "premium" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-admin-warning/15 px-3 py-1 text-xs font-medium text-admin-warning">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            )}

            {challenge.accessType === "free" && (
              <span className="rounded-full bg-admin-pastel-green px-3 py-1 text-xs font-medium text-admin-success">
                Free
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-admin-text sm:text-3xl lg:text-4xl">
            {challenge.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/challenges/${challenge.id}/edit`}
            className={`inline-flex items-center gap-2 rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text shadow-sm shadow-admin-text/5 transition-colors hover:bg-admin-surface-hover ${focusRing}`}
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Link>

          {challenge.status === "draft" && (
            <button
              type="button"
              onClick={onPublish}
              disabled={actionLoading}
              className={`inline-flex items-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-admin-accent-fg shadow-sm transition-colors hover:bg-admin-accent-hover disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              <Sparkles className="h-4 w-4" />
              {actionLoading ? "Publishing..." : "Publish"}
            </button>
          )}

          {challenge.status !== "published" && (
            <button
              type="button"
              onClick={onDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-admin-danger/30 bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-danger shadow-sm shadow-admin-text/5 transition-colors hover:bg-admin-danger-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-danger/50 disabled:cursor-not-allowed disabled:opacity-50"
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

const STATUS_STYLES: Record<string, string> = {
  published:
    "border-admin-success/30 bg-admin-pastel-green text-admin-success",
  draft: "border-admin-warning/30 bg-admin-warning/15 text-admin-warning",
  archived: "border-admin-border bg-admin-bg text-admin-muted",
};

const DEFAULT_STATUS_STYLE = "border-admin-border bg-admin-bg text-admin-muted";

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}