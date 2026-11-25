import { z } from "zod";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
} from "@/constants/common/session.constants";
import { SESSION_LIMITS } from "@/constants/common/session-limits.constants";

export const updateSessionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(
        SESSION_LIMITS.titleMin,
        `Title must contain at least ${SESSION_LIMITS.titleMin} characters.`,
      )
      .max(
        SESSION_LIMITS.titleMax,
        `Title cannot exceed ${SESSION_LIMITS.titleMax} characters.`,
      ),

    description: z
      .string()
      .trim()
      .min(
        SESSION_LIMITS.descriptionMin,
        `Description must contain at least ${SESSION_LIMITS.descriptionMin} characters.`,
      )
      .max(
        SESSION_LIMITS.descriptionMax,
        `Description cannot exceed ${SESSION_LIMITS.descriptionMax} characters.`,
      ),

    type: z.enum(SESSION_TYPES, {
      error: "Please select a valid session type.",
    }),

    pricing: z.object({
      type: z.enum(SESSION_PRICING_TYPES, {
        error: "Please select a valid pricing option.",
      }),

      amount: z.number().finite("Enter a valid price."),

      currency: z.literal("inr"),
    }),

    scheduledAt: z
      .string()
      .trim()
      .min(1, "Choose a date and time.")
      .refine(
        (value) => Number.isFinite(new Date(value).getTime()),
        "Enter a valid date and time.",
      ),

    durationInMinutes: z
      .number()
      .finite("Enter a valid duration.")
      .int("Duration must be a whole number.")
      .min(
        SESSION_LIMITS.durationMin,
        `Duration must be at least ${SESSION_LIMITS.durationMin} minutes.`,
      )
      .max(
        SESSION_LIMITS.durationMax,
        `Duration cannot exceed ${SESSION_LIMITS.durationMax} minutes.`,
      ),

    maxParticipants: z
      .number()
      .finite("Enter a valid participant capacity.")
      .int("Participant capacity must be a whole number.")
      .min(
        SESSION_LIMITS.participantsMin,
        `Allow at least ${SESSION_LIMITS.participantsMin} participants.`,
      )
      .max(
        SESSION_LIMITS.participantsMax,
        `Participant capacity cannot exceed ${SESSION_LIMITS.participantsMax}.`,
      )
      .optional(),
  })
  .superRefine((form, context) => {
    const { type, amount } = form.pricing;

    if (type === "free" && amount !== 0) {
      context.addIssue({
        code: "custom",
        path: ["pricing", "amount"],
        message: "Free sessions must have a price of ₹0.",
      });
    }

    if (type === "paid") {
      if (amount < SESSION_LIMITS.priceMin) {
        context.addIssue({
          code: "custom",
          path: ["pricing", "amount"],
          message: `Price must be at least ₹${SESSION_LIMITS.priceMin}.`,
        });
      } else if (amount > SESSION_LIMITS.priceMax) {
        context.addIssue({
          code: "custom",
          path: ["pricing", "amount"],
          message: `Price cannot exceed ₹${SESSION_LIMITS.priceMax.toLocaleString("en-IN")}.`,
        });
      }
    }
  });

export type UpdateSessionFormValues = z.infer<typeof updateSessionSchema>;

export type UpdateSessionFieldName =
  | "title"
  | "description"
  | "type"
  | "pricingType"
  | "pricingAmount"
  | "scheduledAt"
  | "durationInMinutes"
  | "maxParticipants";

export type UpdateSessionFieldErrors = Partial<
  Record<UpdateSessionFieldName, string>
>;

const FIELD_PATHS: Record<string, UpdateSessionFieldName> = {
  title: "title",
  description: "description",
  type: "type",
  "pricing.type": "pricingType",
  "pricing.amount": "pricingAmount",
  scheduledAt: "scheduledAt",
  durationInMinutes: "durationInMinutes",
  maxParticipants: "maxParticipants",
};

export function getUpdateSessionFieldErrors(
  values: unknown,
  originalScheduledAt: string,
): UpdateSessionFieldErrors {
  const result = updateSessionSchema.safeParse(values);

  const errors: UpdateSessionFieldErrors = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = FIELD_PATHS[issue.path.join(".")];

      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  if (
    typeof values === "object" &&
    values !== null &&
    "scheduledAt" in values &&
    typeof values.scheduledAt === "string"
  ) {
    const scheduledAt = values.scheduledAt;
    const scheduledDate = new Date(scheduledAt);

    const isValidDate = Number.isFinite(scheduledDate.getTime());
    const scheduleChanged = scheduledAt !== originalScheduledAt;

    if (
      scheduledAt.length > 0 &&
      scheduleChanged &&
      isValidDate &&
      scheduledDate.getTime() <= Date.now()
    ) {
      errors.scheduledAt = "Choose a date and time in the future.";
    }
  }

  return errors;
}
