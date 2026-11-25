
export function EditSessionLoading() {
  return (
    <div
      className="mx-auto max-w-2xl space-y-8"
      aria-label="Loading session"
      aria-busy="true"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />

        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-7 w-56 animate-pulse rounded bg-slate-200" />
        </div>
      </div>

      <div className="space-y-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-11 w-full animate-pulse rounded-xl bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}
