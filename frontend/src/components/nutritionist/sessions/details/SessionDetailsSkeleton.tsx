
export default function SessionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-7 w-56 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
