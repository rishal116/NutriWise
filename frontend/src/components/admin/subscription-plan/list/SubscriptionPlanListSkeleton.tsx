
export function SubscriptionPlanListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-admin-border bg-admin-surface p-5"
        >
          <div className="flex justify-between">
            <div className="size-10 rounded-xl bg-admin-surface-hover" />
            <div className="h-6 w-16 rounded-full bg-admin-surface-hover" />
          </div>

          <div className="mt-5 h-3 w-24 rounded bg-admin-surface-hover" />
          <div className="mt-2 h-5 w-3/4 rounded bg-admin-surface-hover" />
          <div className="mt-2 h-4 w-full rounded bg-admin-surface-hover" />
          <div className="mt-2 h-4 w-2/3 rounded bg-admin-surface-hover" />

          <div className="my-5 space-y-3 border-y border-admin-border py-5">
            <div className="h-7 w-2/3 rounded bg-admin-surface-hover" />
            <div className="h-4 w-1/2 rounded bg-admin-surface-hover" />
          </div>

          <div className="flex gap-2">
            <div className="h-9 flex-1 rounded-lg bg-admin-surface-hover" />
            <div className="size-9 rounded-lg bg-admin-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}
