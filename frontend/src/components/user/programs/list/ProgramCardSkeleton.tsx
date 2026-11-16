export function ProgramCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-5 w-2/3 rounded bg-slate-200" />
      <div className="mt-4 h-3 w-1/2 rounded bg-slate-200" />
      <div className="mt-6 h-2 w-full rounded bg-slate-200" />
      <div className="mt-6 flex justify-between">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>
    </div>
  );
}