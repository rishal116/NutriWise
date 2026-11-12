
import Link from "next/link";

import { AlertCircle, Plus } from "lucide-react";

import type { PlanTab } from "@/constants/nutritionist/plan/plan.constants";

interface PlanEmptyStateProps {
  activeTab: PlanTab;
  hasFilters: boolean;
}

export default function PlanEmptyState({
  activeTab,
  hasFilters,
}: PlanEmptyStateProps) {
  const title = hasFilters
    ? "No matching plans"
    : activeTab === "all"
      ? "Ready to launch?"
      : `No ${activeTab} plans`;

  const description = hasFilters
    ? "Try adjusting your search or filters."
    : activeTab === "all"
      ? "Create your first nutrition plan and start helping clients today."
      : `You don't have any ${activeTab} plans yet.`;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-100 bg-emerald-50/40 px-6 py-20 text-center">
      <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
        <AlertCircle size={32} className="text-emerald-600" />
      </div>

      <h2 className="text-lg font-bold text-slate-800">
        {title}
      </h2>

      <p className="mt-2 max-w-xs text-sm text-slate-500">
        {description}
      </p>

      {!hasFilters && activeTab === "all" && (
        <Link
          href="/nutritionist/plans/create"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={16} />
          Create Plan
        </Link>
      )}
    </div>
  );
}
