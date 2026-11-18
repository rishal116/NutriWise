interface ProgramEmptyStateProps {
  hasActiveFilters: boolean;
}

export function ProgramEmptyState({
  hasActiveFilters,
}: ProgramEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-xs">
      <p className="text-sm font-bold text-slate-700">
        No programs found
      </p>

      <p className="text-xs font-medium text-slate-400">
        {hasActiveFilters
          ? "Try a different search term or filter."
          : "Client programs will show up here once created."}
      </p>
    </div>
  );
}