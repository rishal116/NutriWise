import { ClipboardList } from "lucide-react";

interface ProgramErrorStateProps {
  isRetrying: boolean;
  onRetry: () => void;
}

export function ProgramErrorState({
  isRetrying,
  onRetry,
}: ProgramErrorStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
        <ClipboardList className="h-6 w-6 text-rose-700" />
      </div>

      <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
        Couldn&apos;t load your programs
      </h2>

      <p className="mt-1 text-xs font-medium text-slate-500">
        Something went wrong. Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRetrying ? "Retrying..." : "Try again"}
      </button>
    </div>
  );
}