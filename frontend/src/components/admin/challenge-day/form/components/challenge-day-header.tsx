"use client";

import { ArrowLeft } from "lucide-react";

interface ChallengeDayHeaderProps {
  mode: "create" | "edit";
  activityCount: number;
  saving: boolean;
  onBack: () => void;
}

export default function ChallengeDayHeader({
  mode,
  activityCount,
  saving,
  onBack,
}: ChallengeDayHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-admin-muted transition-colors hover:text-admin-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Challenge Days
      </button>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-admin-pastel-green px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-admin-accent">
            Challenge Day
          </span>

          <h1 className="mt-3 text-2xl font-bold text-admin-text">
            {mode === "create" ? "Create Challenge Day" : "Edit Challenge Day"}
          </h1>

          <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-admin-muted">
            Build the day and define exactly what participants need to complete.
          </p>
        </div>

        <div className="rounded-2xl border border-admin-border bg-admin-surface px-4 py-3 shadow-sm shadow-admin-text/5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-admin-muted">
            Activities
          </p>

          <p className="mt-0.5 text-lg font-bold text-admin-text">
            {activityCount}
          </p>
        </div>
      </div>
    </>
  );
}