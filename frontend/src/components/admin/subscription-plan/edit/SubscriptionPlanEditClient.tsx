
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type { AdminSubscriptionPlanDetailsDTO } from "@/dtos/admin/subscription-plan/admin-subscription-plan-details.dto";
import { BILLING_INTERVALS } from "@/constants/common/subscription.constants";
import { updateSubscriptionPlanSchema } from "@/schemas/admin/subscription-plan/update-subscription-plan.schema";
import { adminSubscriptionPlanService } from "@/services/admin/admin-subscription-plan.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface SubscriptionPlanEditClientProps {
  planId: string;
}

type FormValues = z.infer<typeof updateSubscriptionPlanSchema>;

const inputClass =
  "w-full rounded-xl border border-admin-border bg-admin-background px-4 py-3 text-sm text-admin-text outline-none transition placeholder:text-admin-muted focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/10";

const labelClass = "mb-2 block text-sm font-medium text-admin-text";

export default function SubscriptionPlanEditClient({
  planId,
}: SubscriptionPlanEditClientProps) {
  const router = useRouter();

  const [plan, setPlan] =
    useState<AdminSubscriptionPlanDetailsDTO | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(updateSubscriptionPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      billing: {
        amount: 50,
        interval: "monthly",
      },
      features: [],
    },
  });

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const loadPlan = useCallback(async () => {
    setIsLoading(true);

    try {
      const response =
        await adminSubscriptionPlanService.getPlanDetails(planId);

      const details = response.data;

      if (!details) {
        throw new Error("Subscription plan details not found.");
      }

      setPlan(details);

      reset({
        name: details.name,
        description: details.description,
        billing: {
          amount: details.billing.amount,
          interval: details.billing.interval,
        },
        features: details.features.map((feature) => ({
          key: feature.key,
          enabled: feature.enabled,
        })),
      });
    } catch (error: unknown) {
      setPlan(null);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [planId, reset]);

  useEffect(() => {
    void loadPlan();
  }, [loadPlan]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!plan || plan.status === "archived") return;

    setIsSubmitting(true);

    try {
      await adminSubscriptionPlanService.updatePlan(plan.id, data);

      toast.success("Subscription plan updated successfully.");
      router.push(`/admin/subscription-plans/${plan.id}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="animate-spin text-admin-accent"
          size={30}
        />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="rounded-2xl border border-admin-border bg-admin-surface p-8 text-center">
        <h2 className="text-lg font-semibold text-admin-text">
          Subscription plan not found
        </h2>

        <Link
          href="/admin/subscription-plans"
          className="mt-4 inline-flex text-sm font-semibold text-admin-accent"
        >
          Back to subscription plans
        </Link>
      </div>
    );
  }

  if (plan.status === "archived") {
    return (
      <div className="rounded-2xl border border-admin-border bg-admin-surface p-8 text-center">
        <h2 className="text-lg font-semibold text-admin-text">
          Archived plans cannot be edited
        </h2>

        <p className="mt-2 text-sm text-admin-muted">
          This subscription plan is archived and is read-only.
        </p>

        <Link
          href={`/admin/subscription-plans/${plan.id}`}
          className="mt-4 inline-flex text-sm font-semibold text-admin-accent"
        >
          Back to plan details
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <div className="flex items-start gap-3">
        <Link
          href={`/admin/subscription-plans/${plan.id}`}
          aria-label="Back to plan details"
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-admin-border text-admin-muted transition hover:bg-admin-surface-hover"
        >
          <ArrowLeft size={19} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-admin-text">
            Edit subscription plan
          </h1>

          <p className="mt-1 text-sm text-admin-muted">
            Update {plan.name} subscription configuration.
          </p>

          <p className="mt-1 text-xs capitalize text-admin-muted">
            {plan.audience} · {plan.status}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <p className="text-sm text-admin-text">
          The plan slug and existing subscriber snapshots will remain
          unchanged when you update this plan.
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* Basic information */}
          <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
            <h2 className="text-base font-semibold text-admin-text">
              Basic information
            </h2>

            <div className="mt-5 grid gap-5">
              <div>
                <label htmlFor="plan-name" className={labelClass}>
                  Plan name
                </label>

                <input
                  id="plan-name"
                  {...register("name")}
                  className={inputClass}
                  placeholder="e.g. Premium"
                />

                {errors.name && (
                  <p role="alert" className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="plan-description" className={labelClass}>
                  Description
                </label>

                <textarea
                  id="plan-description"
                  rows={4}
                  {...register("description")}
                  className={`${inputClass} resize-y`}
                  placeholder="Describe what this subscription offers..."
                />

                {errors.description && (
                  <p role="alert" className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ReadOnlyField label="Audience" value={plan.audience} />
                <ReadOnlyField label="Slug" value={plan.slug} />
              </div>
            </div>
          </section>

          {/* Billing */}
          <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
            <h2 className="text-base font-semibold text-admin-text">
              Billing configuration
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
                  {BILLING_INTERVALS.map((interval) => (
                    <option key={interval} value={interval}>
                      {interval === "monthly" ? "Monthly" : "Yearly"}
                    </option>
                  ))}
                </select>

                {errors.billing?.interval && (
                  <p role="alert" className="mt-1 text-xs text-red-500">
                    {errors.billing.interval.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-admin-text">
                  Plan features
                </h2>

                <p className="mt-1 text-sm text-admin-muted">
                  Configure the features available in this subscription.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  append({
                    key: "",
                    enabled: true,
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-admin-border px-4 py-2.5 text-sm font-semibold text-admin-text transition hover:bg-admin-surface-hover"
              >
                <Plus size={16} />
                Add feature
              </button>
            </div>

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

            <div className="mt-5 space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-admin-border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-admin-text">
                      Feature {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remove feature ${index + 1}`}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor={`feature-key-${index}`}
                        className={labelClass}
                      >
                        Feature key
                      </label>

                      <input
                        id={`feature-key-${index}`}
                        {...register(`features.${index}.key`)}
                        className={inputClass}
                        placeholder="e.g. ai_meal_planner"
                      />

                      {errors.features?.[index]?.key && (
                        <p role="alert" className="mt-1 text-xs text-red-500">
                          {errors.features[index].key.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Controller
                        control={control}
                        name={`features.${index}.enabled`}
                        render={({ field: enabledField }) => (
                          <input
                            ref={enabledField.ref}
                            name={enabledField.name}
                            type="checkbox"
                            checked={enabledField.value}
                            onChange={enabledField.onChange}
                            onBlur={enabledField.onBlur}
                            className="h-4 w-4 accent-admin-accent"
                          />
                        )}
                      />

                      <span className="text-sm text-admin-text">
                        Feature enabled
                      </span>

                      {errors.features?.[index]?.enabled && (
                        <p role="alert" className="text-xs text-red-500">
                          {errors.features[index].enabled.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <p className="rounded-xl border border-dashed border-admin-border p-6 text-center text-sm text-admin-muted">
                  No features added yet. Add at least one feature.
                </p>
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/admin/subscription-plans/${plan.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-admin-border px-5 py-3 text-sm font-semibold text-admin-muted transition hover:bg-admin-surface-hover"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-admin-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 size={17} className="animate-spin" />
              )}

              {isSubmitting ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-admin-muted">
        {label}
      </p>

      <p className="text-sm font-medium capitalize text-admin-text">
        {value}
      </p>
    </div>
  );
}
