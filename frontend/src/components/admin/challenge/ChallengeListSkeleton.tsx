export function ChallengeListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"
          >
            <div className="h-28 w-full rounded-lg bg-slate-100" />

            <div className="mt-3.5 h-4 w-3/4 rounded bg-slate-100" />

            <div className="mt-2 h-3 w-full rounded bg-slate-100" />

            <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />

            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
              <div className="h-7 rounded bg-slate-100" />
              <div className="h-7 rounded bg-slate-100" />
              <div className="h-7 rounded bg-slate-100" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}