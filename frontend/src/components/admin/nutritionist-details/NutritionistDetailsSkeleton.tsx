export default function NutritionistDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading nutritionist profile"
      className="mx-auto max-w-6xl animate-pulse space-y-6"
    >
      <div className="h-5 w-24 rounded bg-admin-border" />

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="h-[34rem] rounded-2xl border border-admin-border bg-admin-surface" />

        <div className="space-y-6">
          <div className="h-64 rounded-2xl border border-admin-border bg-admin-surface" />
          <div className="h-48 rounded-2xl border border-admin-border bg-admin-surface" />
          <div className="h-40 rounded-2xl border border-admin-border bg-admin-surface" />
        </div>
      </div>
    </div>
  );
}