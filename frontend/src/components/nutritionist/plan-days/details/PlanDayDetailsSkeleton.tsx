export function PlanDayDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-5 w-32 rounded bg-slate-200" />

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-3 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-8 w-48 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-64 max-w-full rounded bg-slate-100" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="mt-6 h-4 w-48 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-3 h-4 w-3/4 rounded bg-slate-100" />
        </div>

        <div className="space-y-4">
          <div className="h-6 w-28 rounded bg-slate-200" />

          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="h-5 w-24 rounded bg-slate-200" />
              <div className="mt-4 h-5 w-2/3 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded bg-slate-100" />

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="h-16 rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}