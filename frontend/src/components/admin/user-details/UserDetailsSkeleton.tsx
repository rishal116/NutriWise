export default function UserDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading user details"
      className="mx-auto max-w-6xl animate-pulse space-y-6"
    >
      <div className="h-5 w-32 rounded bg-admin-border" />

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="h-80 rounded-2xl border border-admin-border bg-admin-surface" />

        <div className="space-y-6">
          <div className="h-72 rounded-2xl border border-admin-border bg-admin-surface" />
          <div className="h-64 rounded-2xl border border-admin-border bg-admin-surface" />
        </div>
      </div>
    </div>
  );
}