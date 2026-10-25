export default function NutritionistDetailsSkeleton() {
  return (
    <main
      className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Loading nutritionist profile"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-5 w-24 rounded bg-slate-200" />

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="h-[34rem] rounded-2xl bg-white shadow-sm" />

          <div className="space-y-6">
            <div className="h-64 rounded-2xl bg-white shadow-sm" />
            <div className="h-48 rounded-2xl bg-white shadow-sm" />
            <div className="h-40 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </main>
  );
}