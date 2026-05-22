import { z } from "zod";

export const createSessionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(150, "Title is too long"),

    description: z
      .string()
      .max(500, "Description is too long")
      .optional(),

    type: z.enum(["free", "paid"]),

    price: z.number().min(0),

    scheduledAt: z
      .string()
      .min(1, "Please select a date and time")
      .refine(
        (date) => new Date(date) > new Date(),
        "Session cannot be scheduled in the past"
      ),

    durationInMinutes: z
      .number()
      .min(15, "Minimum duration is 15 minutes")
      .max(180, "Maximum duration is 180 minutes"),

    maxParticipants: z
      .number()
      .min(1, "At least 1 participant is required")
      .max(100, "Maximum participants allowed is 100"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "paid" && data.price < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Paid sessions must have a minimum price of 50",
      });
    }

    if (data.type === "free" && data.price !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Free sessions must have price 0",
      });
    }
  });

export type CreateSessionSchema = z.infer<typeof createSessionSchema>;