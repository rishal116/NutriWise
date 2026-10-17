export default function SessionsLoading() {
  return (
    <main
      className="mx-auto max-w-7xl space-y-6 p-6"
      role="status"
      aria-label="Loading sessions"
    >
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

      <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-slate-200 p-5"
          >
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading sessions...</span>
    </main>
  );
}
