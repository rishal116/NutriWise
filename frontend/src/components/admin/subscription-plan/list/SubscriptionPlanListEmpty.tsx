
import Link from "next/link";
import { Plus, SearchX } from "lucide-react";

interface SubscriptionPlanListEmptyProps {
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function SubscriptionPlanListEmpty({
  isFiltered,
  onClearFilters,
}: SubscriptionPlanListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-admin-border bg-admin-surface px-5 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-admin-accent/10 text-admin-accent">
        <SearchX className="size-7" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-admin-text">
        {isFiltered ? "No matching plans found" : "No subscription plans yet"}
      </h2>

      <p className="mt-2 max-w-sm text-sm text-admin-muted">
        {isFiltered
          ? "Try changing your search or filters to find subscription plans."
          : "Create your first subscription plan to start managing platform memberships."}
      </p>

      {isFiltered ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-xl border border-admin-border px-4 py-2.5 text-sm font-semibold text-admin-text transition-colors hover:bg-admin-surface-hover"
        >
          Clear filters
        </button>
      ) : (
        <Link
          href="/admin/subscription-plans/new"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Create Subscription Plan
        </Link>
      )}
    </div>
  );
}
