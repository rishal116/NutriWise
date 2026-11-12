"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { nutritionistPlanService } from "@/services/nutritionist/nutri-plan.service";

import type { CreatePlanDto } from "@/dtos/nutritionist/plan/create-plan.dto";
import { createCreatePlanSchema } from "@/schemas/nutritionist/plan/create-plan.schema";

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

export default function useCreatePlan() {
  const router = useRouter();

  const [form, setForm] = useState<CreatePlanForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<CreatePlanFormErrors>({});

  const [categories, setCategories] = useState<PlanOption[]>([]);
  const [priceLimits, setPriceLimits] = useState<PlanPriceLimits | null>(null);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMetadata = async () => {
      try {
        const metadata = await nutritionistPlanService.getPlanMetadata();

        if (!isMounted) return;

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
      } catch (error) {
        console.error("Failed to load plan metadata:", error);

        if (isMounted) {
          toast.error("Unable to load plan settings.");
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    void fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  const validateFields = useCallback(
    (
      values: CreatePlanForm,
      fields: (keyof CreatePlanForm)[],
    ): CreatePlanFormErrors => {
      const schema = createCreatePlanSchema(priceLimits);
      const result = schema.safeParse(values);

      const fieldErrors: CreatePlanFormErrors = {};

      if (!result.success) {
        for (const field of fields) {
          const issue = result.error.issues.find(
            (item) => item.path[0] === field,
          );

          if (issue) {
            fieldErrors[field] = issue.message;
          }
        }
      }

      return fieldErrors;
    },
    [priceLimits],
  );

  const updateField = useCallback(
    <K extends keyof CreatePlanForm>(field: K, value: CreatePlanForm[K]) => {
      const updatedForm: CreatePlanForm = {
        ...form,
        [field]: value,
      };

      setForm(updatedForm);

      const fieldsToValidate: (keyof CreatePlanForm)[] = [field];

      if (field === "durationDays") {
        fieldsToValidate.push("price");
      }

      const updatedErrors = validateFields(updatedForm, fieldsToValidate);

      setErrors((previous) => {
        const nextErrors = { ...previous };

        for (const validatedField of fieldsToValidate) {
          delete nextErrors[validatedField];

          if (updatedErrors[validatedField]) {
            nextErrors[validatedField] = updatedErrors[validatedField];
          }
        }

        return nextErrors;
      });
    },
    [form, validateFields],
  );

  const validateForm = useCallback((): boolean => {
    const schema = createCreatePlanSchema(priceLimits);
    const result = schema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: CreatePlanFormErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof CreatePlanForm;

      if (!newErrors[field]) {
        newErrors[field] = issue.message;
      }
    }

    setErrors(newErrors);

    return false;
  }, [form, priceLimits]);

  const submitPlan = useCallback(async () => {
    if (isSubmitting || !validateForm()) {
      return;
    }

    if (!form.specialization) {
      return;
    }

    setIsSubmitting(true);

    const payload: CreatePlanDto = {
      title: form.title.trim(),
      specialization: form.specialization,
      description: form.description.trim(),
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      features: form.features.map((feature) => feature.trim()).filter(Boolean),
    };

    try {
      await nutritionistPlanService.createPlan(payload);

      toast.success("Nutrition plan created successfully.");
      router.push("/nutritionist/plans");
    } catch (error) {
      console.error("Failed to create nutritionist plan:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to create your plan.",
      );

      setIsSubmitting(false);
    }
  }, [form, isSubmitting, router, validateForm]);

  return {
    form,
    errors,
    categories,
    priceLimits,
    loadingCategories,
    isSubmitting,
    updateField,
    submitPlan,
  };
}
