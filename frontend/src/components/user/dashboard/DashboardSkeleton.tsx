function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-4 w-28 rounded bg-slate-100" />
      <div className="mt-4 h-8 w-20 rounded bg-slate-100" />
      <div className="mt-4 h-3 w-full rounded bg-slate-100" />
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="animate-pulse rounded-3xl bg-slate-100 p-7 sm:p-10">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-5 h-9 w-64 max-w-full rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full max-w-lg rounded bg-slate-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <LoadingCard />
          <LoadingCard />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    </main>
  );
}