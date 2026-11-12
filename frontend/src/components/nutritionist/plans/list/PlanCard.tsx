import Link from "next/link";
import { Clock, ListChecks } from "lucide-react";

import type { NutritionistPlanListItemDto } from "@/dtos/nutritionist/plan/nutritionist-plan-list-item.dto";

interface PlanCardProps {
  plan: NutritionistPlanListItemDto;
}

export default function PlanCard({ plan }: PlanCardProps) {
  const isPublished = plan.status === "published";
  const isComplete = plan.configuredDays >= plan.durationDays;
  const progress =
    plan.durationDays > 0
      ? Math.min(
          100,
          Math.round((plan.configuredDays / plan.durationDays) * 100),
        )
      : 0;

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: plan.currency,
    maximumFractionDigits: 0,
  }).format(plan.price);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {plan.specialization.replace(/_/g, " ")}
          </span>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
              isPublished
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {plan.status}
          </span>
        </div>

        <div className="space-y-1.5">
          <h2 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900">
            {plan.title}
          </h2>

          <p className="line-clamp-2 text-sm text-slate-500">
            {plan.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-emerald-700" />
            {plan.durationDays} days
          </span>

          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5 text-emerald-700" />
            {plan.features.length} features
          </span>
        </div>

        {!isComplete && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-amber-700">Setup incomplete</span>
              <span className="text-slate-500">
                {plan.configuredDays}/{plan.durationDays} days
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Days configured"
              className="h-1.5 overflow-hidden rounded-full bg-slate-100"
            >
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
        <span className="text-lg font-bold tracking-tight text-slate-900">
          {price}
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/nutritionist/plans/${plan.id}`}
            className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
