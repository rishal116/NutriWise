export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="aspect-[4/3] w-full animate-pulse bg-slate-100" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
        <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-2 flex gap-4 border-t border-slate-100 pt-3">
          <div className="h-3 w-8 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-8 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-8 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function PostCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}