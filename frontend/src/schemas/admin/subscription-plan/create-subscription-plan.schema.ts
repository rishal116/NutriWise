import { z } from "zod";

import { SUBSCRIPTION_AUDIENCES } from "@/constants/common/subscription.constants";

import { subscriptionPlanBillingSchema } from "./subscription-plan-billing.schema";
import { subscriptionPlanFeatureSchema } from "./subscription-plan-feature.schema";

export const createSubscriptionPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Plan name is required.")
    .max(100, "Plan name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .min(1, "Plan description is required.")
    .max(2000, "Description must not exceed 2000 characters."),

  audience: z.enum(SUBSCRIPTION_AUDIENCES, {
    error: "Please select a valid subscription audience.",
  }),

  billing: subscriptionPlanBillingSchema,

  features: z
    .array(subscriptionPlanFeatureSchema)
    .min(1, "Add at least one feature to the subscription plan.")
    .superRefine((features, ctx) => {
      const keys = features.map((feature) => feature.key.trim());
      const uniqueKeys = new Set(keys);

      if (uniqueKeys.size !== keys.length) {
        ctx.addIssue({
          code: "custom",
          message: "Each feature must have a unique key.",
        });
      }
    }),
});
