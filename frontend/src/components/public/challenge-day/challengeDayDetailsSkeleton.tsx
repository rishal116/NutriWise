export function ChallengeDayDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />

          <div className="mt-8 space-y-4">
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 max-w-xl animate-pulse rounded bg-muted" />
            <div className="h-5 max-w-2xl animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] space-y-5 px-4 py-10 sm:px-6 lg:px-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border"
          >
            <div className="aspect-video animate-pulse bg-muted" />

            <div className="space-y-4 p-6">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
