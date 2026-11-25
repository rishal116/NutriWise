export default function SessionCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"
    >
      <div className="h-36 w-full shrink-0 bg-slate-200" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-6 w-3/4 rounded bg-slate-200" />

        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
        </div>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="h-4 w-1/3 rounded bg-slate-200" />
        </div>

        <div className="h-[34px] w-full rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
