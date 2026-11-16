import { ClipboardList, Search } from "lucide-react";

interface ProgramEmptyStateProps {
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function ProgramEmptyState({
  hasActiveFilters,
  onReset,
}: ProgramEmptyStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
        {hasActiveFilters ? (
          <Search className="h-6 w-6 text-emerald-600" />
        ) : (
          <ClipboardList className="h-6 w-6 text-emerald-600" />
        )}
      </div>

      <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
        {hasActiveFilters
          ? "No programs match your filters"
          : "No purchased programs"}
      </h2>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {hasActiveFilters
          ? "Try adjusting your search or filters."
          : "Purchase a nutrition program to begin your journey."}
      </p>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
