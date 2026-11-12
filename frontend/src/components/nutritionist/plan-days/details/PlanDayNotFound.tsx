import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

interface PlanDayNotFoundProps {
  message: string;
  onBack: () => void;
  onRetry: () => void;
}

export function PlanDayNotFound({
  message,
  onBack,
  onRetry,
}: PlanDayNotFoundProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50/70 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <AlertCircle className="h-7 w-7 text-rose-500" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Unable to load plan day
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {message}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to plan days
          </button>

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}