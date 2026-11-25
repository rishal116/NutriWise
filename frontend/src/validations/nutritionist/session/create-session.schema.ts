import { z } from "zod";

import {
  SESSION_PRICING_TYPES,
  SESSION_TYPES,
} from "@/constants/common/session.constants";
import { SESSION_LIMITS as CREATE_SESSION_LIMITS } from "@/constants/common/session-limits.constants";

export const createSessionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(
        CREATE_SESSION_LIMITS.titleMin,
        `Title must contain at least ${CREATE_SESSION_LIMITS.titleMin} characters.`,
      )
      .max(
        CREATE_SESSION_LIMITS.titleMax,
        `Title cannot exceed ${CREATE_SESSION_LIMITS.titleMax} characters.`,
      ),

    description: z
      .string()
      .trim()
      .min(
        CREATE_SESSION_LIMITS.descriptionMin,
        `Description must contain at least ${CREATE_SESSION_LIMITS.descriptionMin} characters.`,
      )
      .max(
        CREATE_SESSION_LIMITS.descriptionMax,
        `Description cannot exceed ${CREATE_SESSION_LIMITS.descriptionMax} characters.`,
      ),

    type: z.enum(SESSION_TYPES, {
      error: "Please select a valid session type.",
    }),

    pricingType: z.enum(SESSION_PRICING_TYPES, {
      error: "Please select a pricing option (Free or Paid).",
    }),

    pricing: z.object({
      amount: z.number().finite("Enter a valid price."),
      currency: z.literal("inr"),
    }),

    scheduledAt: z
      .string()
      .min(1, "Choose a date and time.")
      .refine(
        (value) => Number.isFinite(new Date(value).getTime()),
        "Enter a valid date and time.",
      )
      .refine(
        (value) => new Date(value).getTime() > Date.now(),
        "Choose a date and time in the future.",
      ),

    duration: z
      .number()
      .int("Duration must be a whole number.")
      .min(
        CREATE_SESSION_LIMITS.durationMin,
        `Duration must be at least ${CREATE_SESSION_LIMITS.durationMin} minutes.`,
      )
      .max(
        CREATE_SESSION_LIMITS.durationMax,
        `Duration cannot exceed ${CREATE_SESSION_LIMITS.durationMax} minutes.`,
      ),

    maxParticipants: z
      .number()
      .int("Participant capacity must be a whole number.")
      .min(
        CREATE_SESSION_LIMITS.participantsMin,
        `Allow at least ${CREATE_SESSION_LIMITS.participantsMin} participants.`,
      )
      .max(
        CREATE_SESSION_LIMITS.participantsMax,
        `Participant capacity cannot exceed ${CREATE_SESSION_LIMITS.participantsMax}.`,
      ),
  })
  .superRefine((form, context) => {
    const { pricingType, pricing } = form;
    const { amount } = pricing;

    if (pricingType === "free" && amount !== 0) {
      context.addIssue({
        code: "custom",
        path: ["pricing", "amount"],
        message: "Free sessions must have a price of ₹0.",
      });
    }

    if (pricingType === "paid") {
      if (amount < CREATE_SESSION_LIMITS.priceMin) {
        context.addIssue({
          code: "custom",
          path: ["pricing", "amount"],
          message: `Price must be at least ₹${CREATE_SESSION_LIMITS.priceMin}.`,
        });
      } else if (amount > CREATE_SESSION_LIMITS.priceMax) {
        context.addIssue({
          code: "custom",
          path: ["pricing", "amount"],
          message: `Price cannot exceed ₹${CREATE_SESSION_LIMITS.priceMax.toLocaleString("en-IN")}.`,
        });
      }
    }
  });

export type CreateSessionFormValues = z.infer<typeof createSessionSchema>;

export type CreateSessionFieldName =
  | "title"
  | "description"
  | "type"
  | "pricingType"
  | "pricingAmount"
  | "scheduledAt"
  | "duration"
  | "maxParticipants";

export type CreateSessionFieldErrors = Partial<
  Record<CreateSessionFieldName, string>
>;

const FIELD_PATHS: Record<string, CreateSessionFieldName> = {
  title: "title",
  description: "description",
  type: "type",
  pricingType: "pricingType",
  scheduledAt: "scheduledAt",
  duration: "duration",
  maxParticipants: "maxParticipants",
  "pricing.amount": "pricingAmount",
};

export function getCreateSessionFieldErrors(
  values: unknown,
): CreateSessionFieldErrors {
  const result = createSessionSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  const errors: CreateSessionFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = FIELD_PATHS[issue.path.join(".")];

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
