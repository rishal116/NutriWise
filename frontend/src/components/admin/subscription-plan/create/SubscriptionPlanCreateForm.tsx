
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import type { CreateSubscriptionPlanDTO } from "@/dtos/admin/subscription-plan/create-subscription-plan.dto";
import { createSubscriptionPlanSchema } from "@/schemas/admin/subscription-plan/create-subscription-plan.schema";
import { adminSubscriptionPlanService } from "@/services/admin/admin-subscription-plan.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

import BasicInformationSection from "./BasicInformationSection";
import BillingSection from "./BillingSection";
import FeaturesSection from "./FeaturesSection";

export default function SubscriptionPlanCreateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CreateSubscriptionPlanDTO>({
    resolver: zodResolver(createSubscriptionPlanSchema),
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<CreateSubscriptionPlanDTO> = async (data) => {
    setIsSubmitting(true);

    try {
      await adminSubscriptionPlanService.createPlan(data);

      toast.success("Subscription plan created successfully.");
      router.push("/admin/subscription-plans");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = () => {
    toast.error("Please correct the highlighted fields.");
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/subscription-plans"
            aria-label="Back to subscription plans"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-admin-border text-admin-muted transition hover:bg-admin-surface-hover hover:text-admin-text"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-admin-text">
              Create Subscription Plan
            </h1>
            <p className="mt-1 text-sm text-admin-muted">
              Configure pricing, audience, and platform feature access.
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-admin-surface-hover px-3 py-1.5 text-xs font-semibold text-admin-muted">
          New plan · Draft
        </span>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          className="space-y-6"
        >
          <BasicInformationSection />
          <BillingSection />
          <FeaturesSection />

          {errors.root?.message && (
            <p role="alert" className="text-sm text-red-500">
              {errors.root.message}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/subscription-plans"
              className="inline-flex items-center justify-center rounded-xl border border-admin-border px-5 py-3 text-sm font-semibold text-admin-muted transition hover:bg-admin-surface-hover hover:text-admin-text"
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
              {isSubmitting ? "Creating..." : "Create draft plan"}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
