import { z } from "zod";
import { CREATE_SESSION_LIMITS } from "./create-session.schema";

export const updateSessionSchema = z
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

    type: z.enum([
      "webinar",
      "workshop",
      "group_consultation",
      "qna",
      "seminar",
    ]),

    pricing: z.object({
      type: z.enum(["free", "paid"]),
      amount: z.number().finite("Enter a valid price."),
      currency: z.literal("inr"),
    }),

    scheduledAt: z
      .string()
      .min(1, "Choose a date and time.")
      .refine(
        (value) => Number.isFinite(new Date(value).getTime()),
        "Enter a valid date and time.",
      ),

    durationInMinutes: z
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

export type UpdateSessionFormValues = z.infer<typeof updateSessionSchema>;

export type UpdateSessionFieldName =
  | "title"
  | "description"
  | "type"
  | "scheduledAt"
  | "durationInMinutes"
  | "maxParticipants"
  | "pricingAmount";

export type UpdateSessionFieldErrors = Partial<
  Record<UpdateSessionFieldName, string>
>;

const FIELD_PATHS: Record<string, UpdateSessionFieldName> = {
  title: "title",
  description: "description",
  type: "type",
  scheduledAt: "scheduledAt",
  durationInMinutes: "durationInMinutes",
  maxParticipants: "maxParticipants",
  "pricing.amount": "pricingAmount",
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

  const form = values as Partial<UpdateSessionFormValues>;
  const scheduledAt = form.scheduledAt;

  if (
    typeof scheduledAt === "string" &&
    scheduledAt.length > 0 &&
    scheduledAt !== originalScheduledAt &&
    Number.isFinite(new Date(scheduledAt).getTime()) &&
    new Date(scheduledAt).getTime() <= Date.now()
  ) {
    errors.scheduledAt = "Choose a date and time in the future.";
  }

  return errors;
}