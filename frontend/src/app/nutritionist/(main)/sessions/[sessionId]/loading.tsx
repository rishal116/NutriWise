export default function SessionDetailsLoading() {
  return (
    <main
      className="mx-auto max-w-5xl space-y-6 p-6"
      role="status"
      aria-label="Loading session details"
    >
      <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="h-64 animate-pulse bg-slate-100" />

        <div className="space-y-4 p-6">
          <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>

      <span className="sr-only">Loading session details...</span>
    </main>
  );
}
