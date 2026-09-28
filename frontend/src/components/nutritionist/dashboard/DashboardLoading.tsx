function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-slate-100 bg-white ${className}`}
    >
      <div className="h-full space-y-4 p-6">
        <div className="h-4 w-28 rounded bg-slate-100" />
        <div className="h-8 w-20 rounded bg-slate-100" />
        <div className="h-3 w-36 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="min-h-full bg-[#fafbfc]">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />

          <div className="h-8 w-72 animate-pulse rounded bg-slate-100" />

          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} className="h-36" />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <SkeletonCard className="h-[390px] xl:col-span-2" />
          <SkeletonCard className="h-[390px]" />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SkeletonCard className="h-[280px]" />
          <SkeletonCard className="h-[280px]" />
        </section>

        <section>
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-slate-100" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} className="h-20" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}