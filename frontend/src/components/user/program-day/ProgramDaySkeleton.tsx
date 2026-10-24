export default function ProgramDaySkeleton() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 h-32 animate-pulse rounded-2xl bg-slate-200" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}
