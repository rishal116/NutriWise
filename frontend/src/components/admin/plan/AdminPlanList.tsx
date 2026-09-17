"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Archive,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";

import { adminPlanService } from "@/services/admin/adminPlan.service";

import type { AdminPlanListItemDTO } from "@/dtos/admin/plan/admin-plan-list-item.dto";
import type { AdminPlanListQueryDTO } from "@/dtos/admin/plan/admin-plan-list-query.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";

const LIMIT = 12;

export default function AdminPlanList() {
  const [plans, setPlans] = useState<AdminPlanListItemDTO[]>([]);

  const [query, setQuery] =
    useState<AdminPlanListQueryDTO>({
      limit: LIMIT,
      sortBy: "newest",
    });

  const [nextCursor, setNextCursor] =
    useState<string | null>(null);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [archivingPlanId, setArchivingPlanId] =
    useState<string | null>(null);

  const fetchPlans = useCallback(
    async (cursor?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await adminPlanService.listPlans({
            ...query,
            cursor,
          });

        const data = response.data;

        if (!cursor) {
          setPlans(data.items);
        } else {
          setPlans((prev) => [
            ...prev,
            ...data.items,
          ]);
        }

        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSearchChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      search: value.trim() || undefined,
    }));
  };

  const handleStatusChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      status:
        value === "all"
          ? undefined
          : (value as AdminPlanListQueryDTO["status"]),
    }));
  };

  const handleSortChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      sortBy: value as AdminPlanListQueryDTO["sortBy"],
    }));
  };

  const handleReset = () => {
    setQuery({
      limit: LIMIT,
      sortBy: "newest",
    });
  };

  const handleArchive = async (planId: string) => {
    try {
      setArchivingPlanId(planId);

      await adminPlanService.archivePlan(planId);

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                status: "archived",
              }
            : plan,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setArchivingPlanId(null);
    }
  };

  if (initialLoading) {
    return <PlansSkeleton />;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-admin-accent">
            <WalletCards className="h-4 w-4" />
            Coaching
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-admin-text">
            Plans
          </h1>

          <p className="mt-1 text-sm text-admin-muted">
            Review and manage nutritionist coaching plans.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchPlans()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-3.5 py-2 text-sm font-medium text-admin-text transition hover:bg-admin-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </header>

      <div className="rounded-xl border border-admin-border bg-admin-surface p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" />

            <input
              type="search"
              placeholder="Search plans or nutritionists..."
              value={query.search ?? ""}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              className="h-10 w-full rounded-lg border border-admin-border bg-admin-surface pl-9 pr-3 text-sm text-admin-text outline-none transition focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/10"
            />
          </label>

          <select
            value={query.status ?? "all"}
            onChange={(event) =>
              handleStatusChange(event.target.value)
            }
            className="h-10 rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-admin-text outline-none focus:border-admin-accent"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={query.sortBy ?? "newest"}
            onChange={(event) =>
              handleSortChange(event.target.value)
            }
            className="h-10 rounded-lg border border-admin-border bg-admin-surface px-3 text-sm text-admin-text outline-none focus:border-admin-accent"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-3 text-sm font-medium text-admin-muted transition hover:text-admin-text"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-admin-border bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Plan
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Nutritionist
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Specialization
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Duration
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Price
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-admin-muted">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-admin-border">
              {plans.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-14 text-center"
                  >
                    <WalletCards className="mx-auto h-8 w-8 text-admin-muted" />

                    <p className="mt-3 text-sm font-medium text-admin-text">
                      No plans found
                    </p>

                    <p className="mt-1 text-xs text-admin-muted">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-admin-text">
                          {plan.title}
                        </p>

                        <p className="mt-1 line-clamp-1 max-w-xs text-xs text-admin-muted">
                          {plan.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-admin-accent-soft text-xs font-semibold text-admin-accent">
                          {plan.nutritionist.profileImage ? (
                            <img
                              src={
                                plan.nutritionist.profileImage
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            plan.nutritionist.fullName
                              .slice(0, 2)
                              .toUpperCase()
                          )}
                        </div>

                        <span className="text-sm font-medium text-admin-text">
                          {plan.nutritionist.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-admin-muted">
                      {plan.specialization}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-admin-muted">
                        <Clock3 className="h-4 w-4" />
                        {plan.durationDays} days
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-admin-text">
                        {plan.currency} {plan.price}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={plan.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      {plan.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleArchive(plan.id)
                          }
                          disabled={
                            archivingPlanId === plan.id
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {archivingPlanId === plan.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Archive className="h-3.5 w-3.5" />
                          )}

                          Archive
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={loading || !nextCursor}
            onClick={() =>
              nextCursor && fetchPlans(nextCursor)
            }
            className="inline-flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2 text-sm font-medium text-admin-text transition hover:bg-admin-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Load more
          </button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: AdminPlanListItemDTO["status"];
}) {
  const styles = {
    published:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    draft:
      "border-amber-200 bg-amber-50 text-amber-700",
    archived:
      "border-slate-200 bg-slate-100 text-slate-600",
  } satisfies Record<
    AdminPlanListItemDTO["status"],
    string
  >;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PlansSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-100" />

      <div className="h-20 animate-pulse rounded-xl bg-slate-100" />

      <div className="overflow-hidden rounded-xl border border-admin-border">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 border-b border-admin-border p-5 last:border-b-0"
          >
            {Array.from({ length: 7 }).map(
              (_, cellIndex) => (
                <div
                  key={cellIndex}
                  className="h-5 animate-pulse rounded bg-slate-100"
                />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}