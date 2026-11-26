
import { useFormContext } from "react-hook-form";

import type { CreateSubscriptionPlanDTO } from "@/dtos/admin/subscription-plan/create-subscription-plan.dto";

const inputClass =
  "w-full rounded-xl border border-admin-border bg-admin-background px-4 py-3 text-sm text-admin-text outline-none transition placeholder:text-admin-muted focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/10";

const labelClass = "mb-2 block text-sm font-medium text-admin-text";

export default function BasicInformationSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateSubscriptionPlanDTO>();

  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-admin-text">
          Basic information
        </h2>
        <p className="mt-1 text-sm text-admin-muted">
          Define the plan details and its intended audience.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="plan-name" className={labelClass}>
            Plan name
          </label>

          <input
            id="plan-name"
            {...register("name")}
            placeholder="e.g. Premium"
            className={inputClass}
          />

          {errors.name && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="plan-description" className={labelClass}>
            Description
          </label>

          <textarea
            id="plan-description"
            rows={4}
            {...register("description")}
            placeholder="Describe what this subscription offers..."
            className={`${inputClass} resize-y`}
          />

          {errors.description && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="plan-audience" className={labelClass}>
            Audience
          </label>

          <select
            id="plan-audience"
            {...register("audience")}
            className={inputClass}
          >
            <option value="">Select audience</option>
            <option value="user">User</option>
            <option value="nutritionist">Nutritionist</option>
          </select>

          {errors.audience && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.audience.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
