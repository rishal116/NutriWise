export function ProgramCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-slate-200" />
        <div className="h-3 w-24 rounded bg-slate-200" />
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-200" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
      </div>
    </div>
  );
}