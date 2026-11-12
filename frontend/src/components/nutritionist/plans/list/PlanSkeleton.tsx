
export default function PlanSkeleton() {
  return (
    <div className="animate-pulse space-y-8 pb-20">
      <div className="h-40 rounded-2xl bg-slate-100" />

      <div className="h-10 w-64 rounded-xl bg-slate-100" />

      <div className="flex gap-3">
        <div className="h-11 flex-1 rounded-xl bg-slate-100" />
        <div className="h-11 w-40 rounded-xl bg-slate-100" />
        <div className="h-11 w-40 rounded-xl bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-80 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
