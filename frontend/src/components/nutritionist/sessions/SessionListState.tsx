"use client";

import { AlertCircle, CalendarX2, RotateCw } from "lucide-react";

interface SessionListStateProps {
  type: "empty" | "error";
  message?: string;
  onRetry?: () => void;
}

export default function SessionListState({
  type,
  message,
  onRetry,
}: SessionListStateProps) {
  if (type === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-xs">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100/80 text-rose-700">
          <AlertCircle className="h-5 w-5" />
        </div>

        <p role="alert" className="text-sm font-semibold text-slate-700">
          {message ?? "We couldn't load your sessions. Please try again."}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800"
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <CalendarX2 className="h-5 w-5" />
      </div>

      <p className="text-sm font-semibold text-slate-700">
        No sessions found
      </p>

      <p className="max-w-sm text-xs font-medium text-slate-500">
        Try adjusting your search or filters, or create a new session to get
        started.
      </p>
    </div>
  );
}