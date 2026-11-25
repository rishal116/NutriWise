export default function SessionSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-[16/9] animate-pulse bg-slate-100" />

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />

          <div className="space-y-1">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-3">
          <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
