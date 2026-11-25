"use client";

import { Video } from "lucide-react";

interface SessionEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function SessionEmptyState({
  hasActiveFilters,
  onClearFilters,
}: SessionEmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
        <Video aria-hidden="true" className="h-5 w-5 text-emerald-600" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        No sessions found
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        Try changing your search or filters to find available sessions.
      </p>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
