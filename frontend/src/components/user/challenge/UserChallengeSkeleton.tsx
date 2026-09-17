export default function UserChallengeSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-[16/9] animate-pulse bg-slate-200" />

          <div className="space-y-4 p-5">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-2 animate-pulse rounded bg-slate-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}