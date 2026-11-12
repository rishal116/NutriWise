import { z } from "zod";

import { PLATFORM_FEATURES } from "@/constants/platform-features";
import {
  MAX_PLAN_DURATION_DAYS,
  MIN_PLAN_DURATION_DAYS,
} from "@/constants/nutritionist/plan/create-plan.constants";

import type { PlanPriceLimits } from "@/types/nutritionist/plan/create-plan-form.types";

export const createCreatePlanSchema = (priceLimits: PlanPriceLimits | null) =>
  z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Plan title is required.")
        .min(5, "Plan title must be at least 5 characters."),

      specialization: z.string().min(1, "Select a specialization."),

      durationDays: z
        .string()
        .min(1, "Plan duration is required.")
        .regex(/^\d+$/, "Duration must contain whole numbers only.")
        .refine((value) => {
          const days = Number(value);

          return (
            Number.isInteger(days) &&
            days >= MIN_PLAN_DURATION_DAYS &&
            days <= MAX_PLAN_DURATION_DAYS
          );
        }, `Duration must be between ${MIN_PLAN_DURATION_DAYS} and ${MAX_PLAN_DURATION_DAYS} days.`),

      price: z
        .string()
        .min(1, "Plan price is required.")
        .regex(/^\d+$/, "Price must contain whole numbers only.")
        .refine((value) => Number(value) > 0, "Enter a valid plan price."),

      description: z
        .string()
        .trim()
        .min(20, "Description must contain at least 20 characters."),

      features: z
        .array(z.string())
        .refine(
          (features) => features.some((feature) => feature.trim().length > 0),
          "Add at least one deliverable.",
        ),
    })
    .superRefine((form, context) => {
      const durationDays = Number(form.durationDays);
      const price = Number(form.price);

      const hasValidDuration =
        Number.isInteger(durationDays) &&
        durationDays >= MIN_PLAN_DURATION_DAYS &&
        durationDays <= MAX_PLAN_DURATION_DAYS;

      const hasValidPrice = /^\d+$/.test(form.price);

      if (priceLimits && hasValidPrice) {
        if (price < priceLimits.min) {
          context.addIssue({
            code: "custom",
            path: ["price"],
            message: `Minimum plan price is ₹${priceLimits.min}.`,
          });
        }

        if (hasValidDuration) {
          const maxPrice = priceLimits.maxPerDay * durationDays;

          if (price > maxPrice) {
            context.addIssue({
              code: "custom",
              path: ["price"],
              message: `Maximum price for ${durationDays} days is ₹${maxPrice.toLocaleString("en-IN")}.`,
            });
          }
        }
      }

      const validFeatures = form.features
        .map((feature) => feature.trim())
        .filter(Boolean);

      const normalizedFeatures = validFeatures.map((feature) =>
        feature.toLowerCase(),
      );

      if (new Set(normalizedFeatures).size !== normalizedFeatures.length) {
        context.addIssue({
          code: "custom",
          path: ["features"],
          message: "Remove duplicate deliverables.",
        });
      }

      if (validFeatures.some((feature) => feature.length < 3)) {
        context.addIssue({
          code: "custom",
          path: ["features"],
          message: "Each deliverable must contain at least 3 characters.",
        });
      }

      const platformFeatures = new Set(
        PLATFORM_FEATURES.map((feature) => feature.toLowerCase()),
      );

      if (
        validFeatures.some((feature) =>
          platformFeatures.has(feature.toLowerCase()),
        )
      ) {
        context.addIssue({
          code: "custom",
          path: ["features"],
          message: "Remove features already included platform-wide.",
        });
      }
    });

export type CreatePlanSchema = ReturnType<typeof createCreatePlanSchema>;
