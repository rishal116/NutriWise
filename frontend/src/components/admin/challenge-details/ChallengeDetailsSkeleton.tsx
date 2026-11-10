export function ChallengeDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading challenge"
      className="mx-auto w-full max-w-7xl animate-pulse"
    >
      <div className="h-4 w-40 rounded bg-admin-border" />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div>
          <div className="h-5 w-72 max-w-full rounded bg-admin-border" />
          <div className="mt-3 h-9 w-96 max-w-full rounded bg-admin-border" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-20 rounded-xl bg-admin-border" />
          <div className="h-10 w-24 rounded-xl bg-admin-border" />
        </div>
      </div>

      <div className="mt-6 aspect-video rounded-2xl bg-admin-border" />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-admin-border bg-admin-surface p-6">
            <div className="h-5 w-48 rounded bg-admin-border" />

            <div className="mt-5 space-y-3">
              <div className="h-4 w-full rounded bg-admin-border" />
              <div className="h-4 w-11/12 rounded bg-admin-border" />
              <div className="h-4 w-4/5 rounded bg-admin-border" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-20 rounded-xl bg-admin-surface-hover"
                />
              ))}
            </div>
          </div>

          <div className="h-48 rounded-2xl border border-admin-border bg-admin-surface" />
        </div>

        <div className="space-y-6">
          <div className="h-40 rounded-2xl border border-admin-border bg-admin-surface" />
          <div className="h-72 rounded-2xl border border-admin-border bg-admin-surface" />
        </div>
      </div>
    </div>
  );
}