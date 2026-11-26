"use client";

import { useCallback, useEffect, useState } from "react";

import { adminSubscriptionPlanService } from "@/services/admin/admin-subscription-plan.service";

import type { AdminSubscriptionPlanCardDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-card.dto";
import type { AdminSubscriptionPlanListQueryDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

import { SubscriptionPlanListHeader } from "./SubscriptionPlanListHeader";
import { SubscriptionPlanFilters } from "./SubscriptionPlanFilters";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";
import { SubscriptionPlanListSkeleton } from "./SubscriptionPlanListSkeleton";
import { SubscriptionPlanListEmpty } from "./SubscriptionPlanListEmpty";

const DEFAULT_QUERY: AdminSubscriptionPlanListQueryDTO = {
  limit: 12,
  sortBy: "newest",
};

export default function SubscriptionPlanList() {
  const [plans, setPlans] = useState<AdminSubscriptionPlanCardDTO[]>([]);
  const [query, setQuery] =
    useState<AdminSubscriptionPlanListQueryDTO>(DEFAULT_QUERY);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(
    async (cursor?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminSubscriptionPlanService.browsePlans({
          ...query,
          cursor,
        });

        if (!response.data) {
          throw new Error("Unable to fetch subscription plans.");
        }

        const data = response.data;

        setPlans((previous) =>
          cursor ? [...previous, ...data.items] : data.items,
        );
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  const updateQuery = <K extends keyof AdminSubscriptionPlanListQueryDTO>(
    field: K,
    value: AdminSubscriptionPlanListQueryDTO[K],
  ) => {
    setQuery((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    updateQuery("search", value.trim() || undefined);
  };

  const handleAudienceChange = (value: string) => {
    updateQuery(
      "audience",
      value === "all"
        ? undefined
        : (value as AdminSubscriptionPlanListQueryDTO["audience"]),
    );
  };

  const handleStatusChange = (value: string) => {
    updateQuery(
      "status",
      value === "all"
        ? undefined
        : (value as AdminSubscriptionPlanListQueryDTO["status"]),
    );
  };

  const handleIntervalChange = (value: string) => {
    updateQuery(
      "interval",
      value === "all"
        ? undefined
        : (value as AdminSubscriptionPlanListQueryDTO["interval"]),
    );
  };

  const handleSortChange = (value: string) => {
    updateQuery("sortBy", value as AdminSubscriptionPlanListQueryDTO["sortBy"]);
  };

  const handleClearFilters = () => {
    setQuery(DEFAULT_QUERY);
  };

  const handleLoadMore = () => {
    if (!nextCursor || loading || !hasMore) {
      return;
    }

    void fetchPlans(nextCursor);
  };

  const isFiltered = Boolean(
    query.search ||
    query.audience ||
    query.status ||
    query.interval ||
    query.sortBy !== "newest",
  );

  return (
    <div className="space-y-6">
      <SubscriptionPlanListHeader planCount={plans.length} />

      <SubscriptionPlanFilters
        query={query}
        isFiltered={isFiltered}
        onSearchChange={handleSearchChange}
        onAudienceChange={handleAudienceChange}
        onStatusChange={handleStatusChange}
        onIntervalChange={handleIntervalChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-admin-danger/30 bg-admin-danger-soft px-4 py-3 text-sm font-medium text-admin-danger"
        >
          {error}
          <button
            type="button"
            onClick={() => void fetchPlans()}
            className="ml-2 rounded font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-danger/50"
          >
            Retry
          </button>
        </div>
      )}

      {loading && plans.length === 0 && <SubscriptionPlanListSkeleton />}

      {!loading && !error && plans.length === 0 && (
        <SubscriptionPlanListEmpty
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
        />
      )}

      {plans.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plans.map((plan) => (
              <SubscriptionPlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-xl border border-admin-border bg-admin-surface px-5 py-2.5 text-sm font-semibold text-admin-text shadow-sm shadow-admin-text/5 transition-colors hover:bg-admin-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
