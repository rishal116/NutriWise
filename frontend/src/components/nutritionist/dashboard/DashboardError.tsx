import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export default function DashboardError({
  message,
  onRetry,
}: DashboardErrorProps) {
  return (
    <main className="min-h-full bg-[#fafbfc]">
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertCircle size={22} />
          </div>

          <h1 className="mt-5 text-lg font-bold text-slate-900">
            Dashboard couldn&apos;t load
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {message}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}