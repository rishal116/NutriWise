
export function ProfileSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-4">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mx-auto mb-5 h-32 w-32 rounded-full bg-slate-100" />
          <div className="mx-auto mb-2 h-5 w-40 rounded bg-slate-100" />
          <div className="mx-auto mb-5 h-5 w-32 rounded-full bg-slate-100" />

          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <div className="h-14 rounded-xl bg-slate-50" />
            <div className="h-14 rounded-xl bg-slate-50" />
          </div>
        </div>

        <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="lg:col-span-8">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 h-5 w-48 rounded bg-slate-100" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-slate-100" />
                <div className="h-10 rounded-xl bg-slate-50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
