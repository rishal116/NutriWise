import Link from "next/link";
import { ArrowRight, Users, Sparkles } from "lucide-react";

import type { AdminSubscriptionPlanCardDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-card.dto";

interface SubscriptionPlanCardProps {
  plan: AdminSubscriptionPlanCardDTO;
}

const STATUS_STYLES = {
  draft: "bg-admin-surface-hover text-admin-muted",
  published: "bg-emerald-500/10 text-emerald-600",
  archived: "bg-amber-500/10 text-amber-600",
} as const;

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);

export function SubscriptionPlanCard({ plan }: SubscriptionPlanCardProps) {
  const audienceLabel =
    plan.audience === "user" ? "User Plan" : "Nutritionist Plan";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-admin-accent/10 text-admin-accent">
          <Sparkles className="size-5" />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[plan.status]}`}
        >
          {plan.status}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">
          {audienceLabel}
        </p>

        <h2 className="mt-1 line-clamp-1 text-lg font-bold text-admin-text">
          {plan.name}
        </h2>

        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-admin-muted">
          {plan.description || "No description available."}
        </p>
      </div>

      <div className="my-5 border-y border-admin-border py-4">
        <p className="text-2xl font-bold text-admin-text">
          {formatPrice(plan.billing.amount, plan.billing.currency)}
          <span className="ml-1 text-xs font-medium text-admin-muted">
            / {plan.billing.interval === "monthly" ? "month" : "year"}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-admin-muted">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            {plan.featureCount} features
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" />
            {plan.audience === "user" ? "Users" : "Nutritionists"}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <Link
          href={`/admin/subscription-plans/${plan.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-admin-border px-3 py-2 text-sm font-semibold text-admin-text transition-colors hover:bg-admin-surface-hover"
        >
          Details
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
