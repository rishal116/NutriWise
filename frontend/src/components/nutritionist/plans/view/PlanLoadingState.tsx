
export default function PlanLoadingState() {
  return (
    <div className="mx-auto mt-10 max-w-6xl animate-pulse space-y-8 px-4">
      <div className="h-8 w-32 rounded-lg bg-slate-200" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-48 rounded-2xl bg-slate-100" />
          <div className="h-64 rounded-2xl bg-slate-100" />
        </div>

        <div className="h-80 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
