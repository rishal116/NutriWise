import { z } from "zod";

import {
  MAX_MEETING_DURATION,
  MIN_MEETING_DURATION,
} from "@/constants/meeting";

const isFutureDateTime = (value: string): boolean => {
  if (!value) {
    return false;
  }

  const scheduledAt = new Date(value);

  return (
    Number.isFinite(scheduledAt.getTime()) && scheduledAt.getTime() > Date.now()
  );
};

export const createMeetingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Session title must be at least 3 characters.")
    .max(100, "Session title cannot exceed 100 characters."),

  userId: z.string().regex(/^[a-f\d]{24}$/i, "Please select a valid client."),

  scheduledAt: z
    .string()
    .min(1, "Please select a date and time.")
    .refine(isFutureDateTime, "Please select a future date and time."),

  durationInMinutes: z
    .number()
    .int("Duration must be a whole number.")
    .min(
      MIN_MEETING_DURATION,
      `Duration must be at least ${MIN_MEETING_DURATION} minutes.`,
    )
    .max(
      MAX_MEETING_DURATION,
      `Duration cannot exceed ${MAX_MEETING_DURATION} minutes.`,
    ),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>;
