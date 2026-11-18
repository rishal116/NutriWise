export function ProgramListingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  );
}