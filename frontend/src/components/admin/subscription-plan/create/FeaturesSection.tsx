import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";

import type { CreateSubscriptionPlanDTO } from "@/dtos/admin/subscription-plan/create-subscription-plan.dto";
import SubscriptionPlanFeatureField from "./SubscriptionPlanFeatureField";

export default function FeaturesSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateSubscriptionPlanDTO>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-admin-text">
            Plan features
          </h2>
          <p className="mt-1 text-sm text-admin-muted">
            Configure the platform features this plan unlocks.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              key: "",
              enabled: false,
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={17} />
          Add feature
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-admin-border px-4 py-10 text-center">
          <p className="text-sm font-medium text-admin-text">
            No features added yet
          </p>
          <p className="mt-1 text-xs text-admin-muted">
            Add features to define what this plan unlocks.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <SubscriptionPlanFeatureField
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      )}

      {errors.features?.root?.message && (
        <p role="alert" className="mt-3 text-xs text-red-500">
          {errors.features.root.message}
        </p>
      )}

      {errors.features?.message && (
        <p role="alert" className="mt-3 text-xs text-red-500">
          {errors.features.message}
        </p>
      )}
    </section>
  );
}