"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { nutritionistPlanService } from "@/services/nutritionist/nutri-plan.service";
import type { PlanDto } from "@/dtos/nutritionist/plan/plan.dto";
import type { PlanStatus } from "@/types/plan.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

import PlanOverview from "./PlanOverview";
import PlanDeliverables from "./PlanDeliverables";
import PlanSidebar from "./PlanSidebar";
import PlanStatusActions from "./PlanStatusActions";
import PlanLoadingState from "./PlanLoadingState";
import PlanNotFoundState from "./PlanNotFoundState";
import PlanDaysPreview from "./PlanDaysPreview";

interface ViewPlanClientProps {
  planId: string;
}

export default function ViewPlanClient({ planId }: ViewPlanClientProps) {
  const router = useRouter();

  const [plan, setPlan] = useState<PlanDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchPlan = useCallback(async () => {
    try {
      const response = await nutritionistPlanService.getPlanById(planId);
      setPlan(response);
    } catch {
      toast.error("Failed to load plan details.");
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    void fetchPlan();
  }, [fetchPlan]);

  const updateStatus = async (status: PlanStatus): Promise<boolean> => {
    if (!plan || updatingStatus) return false;

    try {
      setUpdatingStatus(true);

      const response = await nutritionistPlanService.updatePlanStatus(plan.id, {
        status,
      });

      setPlan((currentPlan) =>
        currentPlan ? { ...currentPlan, status } : currentPlan,
      );

      toast.success(response.message);

      router.refresh();

      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <PlanLoadingState />;
  if (!plan) return <PlanNotFoundState />;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-24 sm:px-6">
      {/* Header Actions */}
      <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-sm font-bold text-slate-500 transition-colors hover:text-emerald-700"
        >
          <span className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-colors group-hover:border-emerald-200 group-hover:bg-emerald-50">
            <span aria-hidden="true">←</span>
          </span>
          Back to Portfolio
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <PlanStatusActions
            status={plan.status}
            loading={updatingStatus}
            onStatusChange={updateStatus}
          />

          <button
            type="button"
            onClick={() => router.push(`/nutritionist/plans/${plan.id}/edit`)}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700"
          >
            Edit Plan
          </button>
        </div>
      </div>

      {/* Plan Content */}

      {/* Plan Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <PlanOverview plan={plan} />

          <PlanDeliverables features={plan.features} />

          <PlanDaysPreview planId={plan.id} />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <PlanSidebar plan={plan} />
        </div>
      </div>
    </div>
  );
}
