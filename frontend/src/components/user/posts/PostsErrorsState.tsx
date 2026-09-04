import { RefreshCw, WifiOff } from "lucide-react";

interface PostsErrorStateProps {
  onRetry: () => void;
  compact?: boolean;
}

export function PostsErrorState({ onRetry, compact = false }: PostsErrorStateProps) {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-3 py-6">
        <span className="text-xs font-medium text-slate-500">Couldn&apos;t load more posts.</span>
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100/80 text-rose-700">
        <WifiOff className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900">
        Something went wrong
      </h3>
      <p className="mt-1 max-w-sm text-xs font-medium text-slate-500">
        We couldn&apos;t load your posts. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}