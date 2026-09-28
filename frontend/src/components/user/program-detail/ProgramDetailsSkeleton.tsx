export default function ProgramDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-44 animate-pulse rounded bg-slate-200" />

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>

          <div className="mt-5 h-28 animate-pulse rounded-xl bg-slate-100" />
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-white" />
      </div>
    </main>
  );
}