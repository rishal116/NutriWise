export function ChallengeDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr] lg:items-center">
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-muted" />

            <div className="space-y-5">
              <div className="h-5 w-48 animate-pulse rounded bg-muted" />

              <div className="h-12 max-w-xl animate-pulse rounded bg-muted" />

              <div className="space-y-3">
                <div className="h-4 max-w-2xl animate-pulse rounded bg-muted" />
                <div className="h-4 max-w-xl animate-pulse rounded bg-muted" />
              </div>

              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      </section>
    </main>
  );
}