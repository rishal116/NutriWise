
import { Controller, useFormContext } from "react-hook-form";

import type { CreateSubscriptionPlanDTO } from "@/dtos/admin/subscription-plan/create-subscription-plan.dto";

const inputClass =
  "w-full rounded-xl border border-admin-border bg-admin-background px-4 py-3 text-sm text-admin-text outline-none transition placeholder:text-admin-muted focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/10";

const labelClass = "mb-2 block text-sm font-medium text-admin-text";

export default function BillingSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateSubscriptionPlanDTO>();

  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-admin-text">
          Billing configuration
        </h2>
        <p className="mt-1 text-sm text-admin-muted">
          Set the subscription price and billing frequency.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="plan-price" className={labelClass}>
            Price (INR)
          </label>

          <Controller
            control={control}
            name="billing.amount"
            render={({ field }) => (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-admin-muted">
                  ₹
                </span>

                <input
                  id="plan-price"
                  ref={field.ref}
                  name={field.name}
                  type="number"
                  min={50}
                  step={1}
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  onKeyDown={(event) => {
                    if (["e", "E", "+", "-", "."].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (value === "") {
                      field.onChange(undefined);
                      return;
                    }

                    const amount = Number(value);

                    if (Number.isInteger(amount) && amount >= 0) {
                      field.onChange(amount);
                    }
                  }}
                  placeholder="499"
                  className={`${inputClass} pl-9`}
                />
              </div>
            )}
          />

          {errors.billing?.amount && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.billing.amount.message}
            </p>
          )}

          <p className="mt-1.5 text-xs text-admin-muted">
            Minimum subscription price is ₹50.
          </p>
        </div>

        <div>
          <label htmlFor="billing-interval" className={labelClass}>
            Billing interval
          </label>

          <select
            id="billing-interval"
            {...register("billing.interval")}
            className={inputClass}
          >
            <option value="">Select billing interval</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {errors.billing?.interval && (
            <p role="alert" className="mt-1 text-xs text-red-500">
              {errors.billing.interval.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
