import { SearchX, UsersRound } from "lucide-react";

interface ClientEmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

export default function ClientEmptyState({
  hasFilters,
  onReset,
}: ClientEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        {hasFilters ? (
          <SearchX size={26} aria-hidden="true" />
        ) : (
          <UsersRound size={26} aria-hidden="true" />
        )}
      </div>

      <h2 className="text-base font-bold text-slate-900">
        {hasFilters ? "No matching clients" : "No clients yet"}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try another search term or change the status filter to find your clients."
          : "Your clients will appear here when they are associated with your nutritionist account."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}