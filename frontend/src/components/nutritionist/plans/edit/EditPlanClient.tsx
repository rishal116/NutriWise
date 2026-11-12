"use client";

import useEditPlan from "@/hooks/nutritionist/plan/useEditPlan";

import EditPlanHeader from "./EditPlanHeader";
import PlanCoreDetails from "../shared/PlanCoreDetails";
import PlanDeliverables from "../shared/PlanDeliverables";
import PlanPricing from "../shared/PlanPricing";

interface EditPlanClientProps {
  planId: string;
}

export default function EditPlanClient({ planId }: EditPlanClientProps) {
  const {
    form,
    errors,
    categories,
    priceLimits,
    isLoading,
    isSubmitting,
    updateField,
    submitPlan,
    loadError,
  } = useEditPlan(planId);

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-500" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Loading plan
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Unable to load plan
        </h2>
        <p className="text-sm text-slate-500">
          Please try again or return to your plans.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <EditPlanHeader
        planId={planId}
        isSubmitting={isSubmitting}
        onSave={() => void submitPlan()}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <PlanCoreDetails
            form={form}
            errors={errors}
            categories={categories}
            loadingCategories={false}
            onChange={updateField}
          />

          <PlanDeliverables
            features={form.features}
            error={errors.features}
            onChange={(features) => updateField("features", features)}
          />
        </div>

        <div>
          <PlanPricing
            price={form.price}
            durationDays={form.durationDays}
            error={errors.price}
            priceLimits={priceLimits}
            onChange={(price) => updateField("price", price)}
          />
        </div>
      </div>
    </div>
  );
}
