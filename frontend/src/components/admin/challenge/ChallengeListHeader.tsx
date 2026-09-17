import Link from "next/link";

import { Plus } from "lucide-react";

interface ChallengeListHeaderProps {
  challengeCount: number;
}

export function ChallengeListHeader({
  challengeCount,
}: ChallengeListHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Challenges
          </h1>

          {challengeCount > 0 && (
            <span className="rounded-md border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {challengeCount}
            </span>
          )}
        </div>

        <p className="mt-0.5 text-xs text-slate-500">
          Create, manage, and organize health
          challenges.
        </p>
      </div>

      <Link
        href="/admin/challenges/create"
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Create Challenge</span>
      </Link>
    </div>
  );
}