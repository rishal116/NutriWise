export function ProgramCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />

      <div className="mt-3 flex items-center gap-2">
        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-2.5 w-16 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-14 animate-pulse rounded bg-slate-200" />
          <div className="h-2.5 w-8 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mt-1.5 h-2 w-full animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3">
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
