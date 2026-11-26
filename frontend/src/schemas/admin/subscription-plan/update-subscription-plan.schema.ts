import { z } from "zod";

import { subscriptionPlanBillingSchema } from "./subscription-plan-billing.schema";
import { subscriptionPlanFeatureSchema } from "./subscription-plan-feature.schema";

export const updateSubscriptionPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Plan name is required.")
    .max(100, "Plan name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(2000, "Description must not exceed 2000 characters."),

  billing: subscriptionPlanBillingSchema,

  features: z
    .array(subscriptionPlanFeatureSchema)
    .min(1, "Add at least one feature."),
});
