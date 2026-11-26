import { z } from "zod";

export const subscriptionPlanFeatureSchema = z.object({
  key: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Feature key is required.")
    .max(100, "Feature key must not exceed 100 characters.")
    .regex(
      /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
      "Feature key must contain lowercase letters, numbers, and single dots, hyphens, or underscores between segments.",
    ),

  enabled: z.boolean({
    error: "Please specify whether this feature is enabled.",
  }),
});