
import Link from "next/link";
import { Plus } from "lucide-react";

interface SubscriptionPlanListHeaderProps {
  planCount: number;
}

export function SubscriptionPlanListHeader({
  planCount,
}: SubscriptionPlanListHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-admin-text">
          Subscription Plans
        </h1>
        <p className="mt-1 text-sm text-admin-muted">
          Manage platform subscription plans for users and nutritionists.
        </p>
        <p className="mt-2 text-xs font-medium text-admin-muted">
          {planCount} {planCount === 1 ? "plan" : "plans"} loaded
        </p>
      </div>

      <Link
        href="/admin/subscription-plans/create"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 focus-visible:ring-offset-2"
      >
        <Plus className="size-4" />
        Create Plan
      </Link>
    </div>
  );
}
