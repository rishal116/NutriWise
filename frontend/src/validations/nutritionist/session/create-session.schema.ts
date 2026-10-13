import { z } from "zod";

export const CREATE_SESSION_LIMITS = {
  titleMin: 5,
  titleMax: 100,
  descriptionMin: 20,
  descriptionMax: 2000,
  priceMin: 50,
  priceMax: 10000,
  durationMin: 15,
  durationMax: 180,
  participantsMin: 2,
  participantsMax: 100,
  thumbnailMaxBytes: 5 * 1024 * 1024,
} as const;

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
      )
      .refine(
        (value) => new Date(value).getTime() > Date.now(),
        "Choose a date and time in the future.",
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
      ),
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

export type CreateSessionFormValues = z.infer<typeof createSessionSchema>;

export type CreateSessionFieldName =
  | "title"
  | "description"
  | "type"
  | "scheduledAt"
  | "durationInMinutes"
  | "maxParticipants"
  | "pricingAmount";

export type CreateSessionFieldErrors = Partial<
  Record<CreateSessionFieldName, string>
>;

const FIELD_PATHS: Record<string, CreateSessionFieldName> = {
  title: "title",
  description: "description",
  type: "type",
  scheduledAt: "scheduledAt",
  durationInMinutes: "durationInMinutes",
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
