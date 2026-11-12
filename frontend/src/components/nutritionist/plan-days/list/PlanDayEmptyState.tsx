import { Plus } from "lucide-react";

interface PlanDayEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClear: () => void;
}

export default function PlanDayEmptyState({
  hasFilters,
  onCreate,
  onClear,
}: PlanDayEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">
        {hasFilters ? "No matching days found" : "No days added yet"}
      </p>

      <p className="text-xs text-slate-400">
        {hasFilters
          ? "Try changing your search or filters."
          : "Start building this nutrition plan by adding its first day."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-emerald-200 hover:text-emerald-600"
        >
          Clear filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus size={14} />
          Add day
        </button>
      )}
    </div>
  );
}