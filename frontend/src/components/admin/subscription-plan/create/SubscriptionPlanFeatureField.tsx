
import { Controller, useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";

import type { CreateSubscriptionPlanDTO } from "@/dtos/admin/subscription-plan/create-subscription-plan.dto";

interface SubscriptionPlanFeatureFieldProps {
  index: number;
  onRemove: () => void;
}

const inputClass =
  "w-full rounded-xl border border-admin-border bg-admin-background px-4 py-3 text-sm text-admin-text outline-none transition placeholder:text-admin-muted focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/10";

const labelClass = "mb-2 block text-sm font-medium text-admin-text";

export default function SubscriptionPlanFeatureField({
  index,
  onRemove,
}: SubscriptionPlanFeatureFieldProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateSubscriptionPlanDTO>();

  const featureErrors = errors.features?.[index];

  return (
    <div className="rounded-xl border border-admin-border p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-admin-text">
          Feature {index + 1}
        </h3>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove feature ${index + 1}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10"
        >
          <Trash2 size={17} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor={`feature-key-${index}`} className={labelClass}>
            Feature key
          </label>

          <input
            id={`feature-key-${index}`}
            {...register(`features.${index}.key`)}
            placeholder="e.g. ai_meal_planner"
            className={inputClass}
          />

          {featureErrors?.key && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {featureErrors.key.message}
            </p>
          )}
        </div>

        <Controller
          control={control}
          name={`features.${index}.enabled`}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-admin-text">
              <input
                ref={field.ref}
                name={field.name}
                type="checkbox"
                checked={field.value}
                onBlur={field.onBlur}
                onChange={field.onChange}
                className="h-4 w-4 accent-admin-accent"
              />
              Enable feature
            </label>
          )}
        />

        {featureErrors?.enabled && (
          <p role="alert" className="text-xs text-red-500">
            {featureErrors.enabled.message}
          </p>
        )}
      </div>
    </div>
  );
}
