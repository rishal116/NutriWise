import type { ReactNode } from "react";
import { AlertCircle, RotateCw } from "lucide-react";

export function WidgetSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="-my-3 divide-y divide-slate-100" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex items-center gap-3 py-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-8 w-14 animate-pulse rounded bg-slate-200" />
        </li>
      ))}
    </ul>
  );
}

export function WidgetEmpty({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {description && (
          <p className="mx-auto max-w-xs text-xs font-medium text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function WidgetError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100/80 text-rose-700">
        <AlertCircle className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors duration-150 hover:bg-slate-50"
      >
        <RotateCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}
