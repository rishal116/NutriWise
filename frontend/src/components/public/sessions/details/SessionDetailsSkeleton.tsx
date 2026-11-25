
export default function SessionDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-9 w-36 rounded-xl bg-slate-200" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="aspect-video rounded-3xl bg-slate-200" />
              <div className="h-8 w-2/3 rounded-lg bg-slate-200" />
              <div className="h-24 rounded-2xl bg-slate-200" />
            </div>

            <div className="h-64 rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
