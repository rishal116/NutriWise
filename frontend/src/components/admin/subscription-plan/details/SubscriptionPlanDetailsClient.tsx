"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  Archive,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import type { SubscriptionPlanStatus } from "@/constants/common/subscription.constants";
import type { AdminSubscriptionPlanDetailsDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-details.dto";
import { adminSubscriptionPlanService } from "@/services/admin/admin-subscription-plan.service";
import { formatCurrency } from "@/utils/format-currency";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface SubscriptionPlanDetailsClientProps {
  planId: string;
}

interface ConfirmationToastProps {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  destructive?: boolean;
}

function showConfirmationToast({
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = false,
}: ConfirmationToastProps) {
  toast(title, {
    description,
    duration: 8000,
    action: {
      label: confirmLabel,
      onClick: () => {
        void onConfirm();
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => toast.dismiss(),
    },
    actionButtonStyle: destructive
      ? {
          backgroundColor: "#dc2626",
          color: "#ffffff",
        }
      : undefined,
  });
}

const statusStyles: Record<SubscriptionPlanStatus, string> = {
  draft: "bg-amber-500/10 text-amber-600",
  published: "bg-emerald-500/10 text-emerald-600",
  archived: "bg-gray-500/10 text-gray-500",
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function SubscriptionPlanDetailsClient({
  planId,
}: SubscriptionPlanDetailsClientProps) {
  const [plan, setPlan] = useState<AdminSubscriptionPlanDetailsDTO | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const loadPlan = useCallback(async () => {
    setIsLoading(true);

    try {
      const response =
        await adminSubscriptionPlanService.getPlanDetails(planId);

      if (!response.data) {
        throw new Error("Subscription plan details not found.");
      }

      setPlan(response.data);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    void loadPlan();
  }, [loadPlan]);

  const handlePublish = async () => {
    if (!plan || plan.status !== "draft" || isActionLoading) return;

    showConfirmationToast({
      title: "Publish subscription plan?",
      description: "This plan will become available to its intended audience.",
      confirmLabel: "Publish",
      onConfirm: async () => {
        setIsActionLoading(true);

        try {
          await adminSubscriptionPlanService.publishPlan(plan.id);
          toast.success("Subscription plan published successfully.");
          await loadPlan();
        } catch (error: unknown) {
          toast.error(getErrorMessage(error));
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };
  const handleArchive = async () => {
    if (!plan || plan.status !== "published" || isActionLoading) return;

    showConfirmationToast({
      title: "Archive subscription plan?",
      description:
        "This plan will no longer be available for new subscriptions.",
      confirmLabel: "Archive",
      destructive: true,
      onConfirm: async () => {
        setIsActionLoading(true);

        try {
          await adminSubscriptionPlanService.archivePlan(plan.id);
          toast.success("Subscription plan archived successfully.");
          await loadPlan();
        } catch (error: unknown) {
          toast.error(getErrorMessage(error));
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-admin-accent" size={30} />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="rounded-2xl border border-admin-border bg-admin-surface p-8 text-center">
        <h2 className="text-lg font-semibold text-admin-text">
          Subscription plan not found
        </h2>

        <p className="mt-2 text-sm text-admin-muted">
          The requested plan could not be loaded.
        </p>

        <Link
          href="/admin/subscription-plans"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-admin-accent"
        >
          <ArrowLeft size={16} />
          Back to plans
        </Link>
      </div>
    );
  }

  const canEdit = plan.status !== "archived";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/subscription-plans"
            aria-label="Back to subscription plans"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-admin-border text-admin-muted transition hover:bg-admin-surface-hover"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-admin-text">
                {plan.name}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  statusStyles[plan.status]
                }`}
              >
                {plan.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-admin-muted">
              Subscription plan details and configuration.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Link
              href={`/admin/subscription-plans/${plan.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Edit size={16} />
              Edit plan
            </Link>
          )}

          {plan.status === "draft" && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isActionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-admin-border px-4 py-2.5 text-sm font-semibold text-admin-text transition hover:bg-admin-surface-hover disabled:opacity-50"
            >
              {isActionLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Publish
            </button>
          )}

          {plan.status === "published" && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={isActionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              {isActionLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Archive size={16} />
              )}
              Archive
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-admin-border bg-admin-surface p-5 md:col-span-2">
          <p className="text-sm font-medium text-admin-muted">
            Subscription price
          </p>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold text-admin-text">
              {formatCurrency(plan.billing.amount)}
            </span>

            <span className="text-sm text-admin-muted">
              / {plan.billing.interval === "monthly" ? "month" : "year"}
            </span>
          </div>

          <p className="mt-2 text-xs uppercase text-admin-muted">
            {plan.audience} subscription
          </p>
        </div>

        <div className="rounded-2xl border border-admin-border bg-admin-surface p-5">
          <p className="text-sm font-medium text-admin-muted">Features</p>

          <p className="mt-2 text-3xl font-bold text-admin-text">
            {plan.features.length}
          </p>

          <p className="mt-1 text-xs text-admin-muted">
            Configured plan features
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
        <h2 className="text-base font-semibold text-admin-text">
          Basic information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <DetailItem label="Plan name" value={plan.name} />
          <DetailItem label="Slug" value={plan.slug} />
          <DetailItem label="Audience" value={plan.audience} capitalize />
          <DetailItem label="Status" value={plan.status} capitalize />

          <div className="sm:col-span-2">
            <DetailItem label="Description" value={plan.description} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
        <h2 className="text-base font-semibold text-admin-text">
          Feature configuration
        </h2>

        {plan.features.length === 0 ? (
          <p className="mt-4 text-sm text-admin-muted">
            No features configured for this plan.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {plan.features.map((feature) => (
              <div
                key={feature.key}
                className="flex flex-col gap-3 rounded-xl border border-admin-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="break-all text-sm font-semibold text-admin-text">
                    {feature.key}
                  </p>

                  <p className="mt-1 text-xs text-admin-muted">
                    {feature.enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-admin-text">
                  {feature.enabled ? (
                    <CheckCircle2 size={17} className="text-emerald-500" />
                  ) : (
                    <XCircle size={17} className="text-red-500" />
                  )}

                  <span>{feature.enabled ? "Available" : "Unavailable"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
        <h2 className="text-base font-semibold text-admin-text">
          Provider information
        </h2>

        <div className="mt-5">
          <DetailItem
            label="Stripe Price ID"
            value={plan.providerReferences.stripePriceId ?? "Not created yet"}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
        <h2 className="text-base font-semibold text-admin-text">
          Plan history
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs text-admin-muted">
              <CalendarDays size={15} />
              Created at
            </p>

            <p className="text-sm font-medium text-admin-text">
              {formatDate(plan.createdAt)}
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 text-xs text-admin-muted">
              <Clock size={15} />
              Last updated
            </p>

            <p className="text-sm font-medium text-admin-text">
              {formatDate(plan.updatedAt)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailItem({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-xs font-medium text-admin-muted">{label}</p>

      <p
        className={`break-words text-sm font-medium text-admin-text ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
