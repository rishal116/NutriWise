export default function ClientDetailsSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading client details">
      <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="h-28 bg-slate-100 sm:h-32" />
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
          <div className="h-8 w-36 rounded-lg bg-slate-100" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="mb-5 h-4 w-40 rounded bg-slate-100" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="h-20 rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 h-4 w-36 rounded bg-slate-100" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-52 rounded-xl bg-slate-100" />
          <div className="h-52 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}