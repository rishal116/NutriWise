interface PlanDayListSkeletonProps {
  count?: number;
}

export default function PlanDayListSkeleton({
  count = 6,
}: PlanDayListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  );
}