export default function UserDetailsSkeleton() {
  return (
    <main
      className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"
      aria-busy="true"
      aria-label="Loading user details"
    >
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-5 w-32 rounded bg-slate-200" />

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="h-80 rounded-2xl bg-white shadow-sm" />

          <div className="space-y-6">
            <div className="h-72 rounded-2xl bg-white shadow-sm" />
            <div className="h-64 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </main>
  );
}
