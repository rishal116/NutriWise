export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="h-6 w-1/3 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-100" />
      <div className="h-4 w-5/6 rounded bg-slate-100" />
      <div className="h-40 w-full rounded-xl bg-slate-100" />
    </div>
  );
}
