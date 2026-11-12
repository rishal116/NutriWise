"use client";

import useCreatePlan from "@/hooks/nutritionist/plan/useCreatePlan";

import CreatePlanHeader from "./CreatePlanHeader";
import PlanCoreDetails from "../shared/PlanCoreDetails";
import PlanDeliverables from "../shared/PlanDeliverables";
import PlanPricing from "../shared/PlanPricing";

export default function CreatePlanClient() {
  const {
    form,
    errors,
    categories,
    priceLimits,
    loadingCategories,
    isSubmitting,
    updateField,
    submitPlan,
  } = useCreatePlan();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20">
      <CreatePlanHeader
        isSubmitting={isSubmitting}
        onSaveDraft={() => void submitPlan()}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <PlanCoreDetails
            form={form}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
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
