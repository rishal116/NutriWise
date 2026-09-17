export function ChallengeSectionSkeleton() {
  const CARD_WIDTH_CLASSES =
    "w-[78%] min-w-[78%] sm:w-[45%] sm:min-w-[45%] md:w-[31%] md:min-w-[31%] lg:w-[23%] lg:min-w-[23%] 2xl:w-[17.5%] 2xl:min-w-[17.5%]";

  return (
    <section className="space-y-4" aria-hidden="true">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="h-5 w-1 rounded-full bg-muted" />
        <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="scrollbar-none flex gap-4 overflow-hidden px-4 sm:gap-5 sm:px-6 lg:px-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card ${CARD_WIDTH_CLASSES}`}
          >
            <div className="aspect-[4/5] animate-pulse bg-muted" />
            <div className="space-y-2.5 p-4">
              <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
