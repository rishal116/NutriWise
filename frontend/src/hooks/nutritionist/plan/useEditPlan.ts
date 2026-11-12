"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { nutritionistPlanService } from "@/services/nutritionist/nutri-plan.service";
import { createCreatePlanSchema } from "@/schemas/nutritionist/plan/create-plan.schema";

import type { UpdatePlanDto } from "@/dtos/nutritionist/plan/update-plan.dto";
import type {
  CreatePlanForm,
  CreatePlanFormErrors,
  PlanOption,
  PlanPriceLimits,
} from "@/types/nutritionist/plan/create-plan-form.types";

const INITIAL_FORM: CreatePlanForm = {
  title: "",
  specialization: "",
  durationDays: "",
  price: "",
  description: "",
  features: [""],
};

interface UseEditPlanReturn {
  form: CreatePlanForm;
  errors: CreatePlanFormErrors;
  categories: PlanOption[];
  priceLimits: PlanPriceLimits | null;
  isLoading: boolean;
  isSubmitting: boolean;
  loadError: boolean;
  updateField: <K extends keyof CreatePlanForm>(
    field: K,
    value: CreatePlanForm[K],
  ) => void;
  submitPlan: () => Promise<void>;
}

export default function useEditPlan(planId: string): UseEditPlanReturn {
  const router = useRouter();

  const [form, setForm] = useState<CreatePlanForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<CreatePlanFormErrors>({});
  const [categories, setCategories] = useState<PlanOption[]>([]);
  const [priceLimits, setPriceLimits] = useState<PlanPriceLimits | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const schema = useMemo(
    () => createCreatePlanSchema(priceLimits),
    [priceLimits],
  );

  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      try {
        const [plan, metadata] = await Promise.all([
          nutritionistPlanService.getPlanById(planId),
          nutritionistPlanService.getPlanMetadata(),
        ]);

        if (!isActive) return;

        setCategories(
          metadata.specializations.map((specialization) => ({
            id: specialization,
            label: specialization
              .replace(/_/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
          })),
        );

        setPriceLimits({
          min: metadata.pricing.minPrice,
          maxPerDay: metadata.pricing.maxPricePerDay,
        });

        setForm({
          title: plan.title,
          specialization: plan.specialization,
          durationDays: String(plan.durationDays),
          price: String(plan.price),
          description: plan.description,
          features: plan.features.length ? plan.features : [""],
        });
      } catch (error) {
        console.error("Failed to initialize edit plan", error);

        if (isActive) {
          setLoadError(true);
          toast.error("Failed to load plan");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      isActive = false;
    };
  }, [planId]);

  const updateField = useCallback(
    <K extends keyof CreatePlanForm>(field: K, value: CreatePlanForm[K]) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }));
    },
    [],
  );

  const submitPlan = useCallback(async () => {
    const result = schema.safeParse(form);

    if (!result.success) {
      const nextErrors: CreatePlanFormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreatePlanForm;

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);
      toast.error("Please check the form details");
      return;
    }

    const specialization = form.specialization;

    if (!specialization) {
      toast.error("Select a specialization");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: UpdatePlanDto = {
        title: form.title.trim(),
        specialization,
        description: form.description.trim(),
        durationDays: Number(form.durationDays),
        price: Number(form.price),
        features: form.features
          .map((feature) => feature.trim())
          .filter(Boolean),
      };

      await nutritionistPlanService.updatePlan(planId, payload);

      toast.success("Plan updated successfully");
      router.push(`/nutritionist/plans/${planId}`);
    } catch (error) {
      console.error("Failed to update plan", error);
      toast.error("Failed to update plan");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, planId, router, schema]);

  return {
    form,
    errors,
    categories,
    priceLimits,
    isLoading,
    isSubmitting,
    loadError,
    updateField,
    submitPlan,
  };
}
