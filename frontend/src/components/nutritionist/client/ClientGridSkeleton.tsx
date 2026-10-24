interface ClientGridSkeletonProps {
  count?: number;
}

export default function ClientGridSkeleton({
  count = 6,
}: ClientGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-label="Loading clients"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-100" />
              <div className="h-3 w-1/3 rounded bg-slate-100" />
            </div>
          </div>

          <div className="my-5 h-px bg-slate-100" />

          <div className="space-y-3">
            <div className="h-3 w-1/3 rounded bg-slate-100" />
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="h-2 w-full rounded-full bg-slate-100" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-16 rounded-xl bg-slate-50" />
              <div className="h-16 rounded-xl bg-slate-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}