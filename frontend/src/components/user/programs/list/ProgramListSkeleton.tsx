import { ProgramCardSkeleton } from "./ProgramCardSkeleton";

interface ProgramListSkeletonProps {
  count?: number;
}

export function ProgramListSkeleton({
  count = 6,
}: ProgramListSkeletonProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProgramCardSkeleton key={index} />
      ))}
    </div>
  );
}