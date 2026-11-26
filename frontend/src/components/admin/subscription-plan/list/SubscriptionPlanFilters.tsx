
import { Search, X } from "lucide-react";

import type { AdminSubscriptionPlanListQueryDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";

interface SubscriptionPlanFiltersProps {
  query: AdminSubscriptionPlanListQueryDTO;
  isFiltered: boolean;
  onSearchChange: (value: string) => void;
  onAudienceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onIntervalChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

const selectClassName =
  "h-10 w-full rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-admin-text outline-none transition-colors focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20";

export function SubscriptionPlanFilters({
  query,
  isFiltered,
  onSearchChange,
  onAudienceChange,
  onStatusChange,
  onIntervalChange,
  onSortChange,
  onClearFilters,
}: SubscriptionPlanFiltersProps) {
  return (
    <div className="space-y-4 rounded-xl border border-admin-border bg-admin-surface p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-admin-muted" />
        <input
          type="search"
          value={query.search ?? ""}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search subscription plans..."
          className="h-10 w-full rounded-lg border border-admin-border bg-admin-background pl-9 pr-3 text-sm text-admin-text outline-none transition-colors placeholder:text-admin-muted focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          aria-label="Filter by audience"
          value={query.audience ?? "all"}
          onChange={(event) => onAudienceChange(event.target.value)}
          className={selectClassName}
        >
          <option value="all">All Audiences</option>
          <option value="user">Users</option>
          <option value="nutritionist">Nutritionists</option>
        </select>

        <select
          aria-label="Filter by status"
          value={query.status ?? "all"}
          onChange={(event) => onStatusChange(event.target.value)}
          className={selectClassName}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select
          aria-label="Filter by billing interval"
          value={query.interval ?? "all"}
          onChange={(event) => onIntervalChange(event.target.value)}
          className={selectClassName}
        >
          <option value="all">All Billing Intervals</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <select
          aria-label="Sort subscription plans"
          value={query.sortBy ?? "newest"}
          onChange={(event) => onSortChange(event.target.value)}
          className={selectClassName}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {isFiltered && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-admin-muted transition-colors hover:text-admin-text"
          >
            <X className="size-3.5" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
