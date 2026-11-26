
import { z } from "zod";

import { BILLING_INTERVALS } from "@/constants/common/subscription.constants";

export const subscriptionPlanBillingSchema = z.object({
  amount: z
    .number({
      error: "Billing amount must be a valid number.",
    })
    .int("Billing amount must be a whole number in rupees.")
    .min(50, "Minimum subscription price must be ₹50."),

  interval: z.enum(BILLING_INTERVALS, {
    error: "Please select a valid billing interval.",
  }),
});
