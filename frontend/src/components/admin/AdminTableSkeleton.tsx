export default function AdminTableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading table"
      className="animate-pulse divide-y divide-admin-border"
    >
      <div className="h-14 bg-admin-surface-hover" />

      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-4">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-admin-border" />
          <div className="h-3 w-1/3 rounded-full bg-admin-border" />
          <div className="ml-auto hidden h-3 w-1/5 rounded-full bg-admin-border sm:block" />
        </div>
      ))}
    </div>
  );
}