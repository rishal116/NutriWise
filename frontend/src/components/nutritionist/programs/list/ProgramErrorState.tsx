interface ProgramErrorStateProps {
  onRetry: () => void;
}

export function ProgramErrorState({
  onRetry,
}: ProgramErrorStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-xs">
      <p className="text-sm font-bold text-slate-700">
        Couldn&apos;t load programs
      </p>

      <p className="mt-1 text-xs font-medium text-slate-400">
        Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Try again
      </button>
    </div>
  );
}