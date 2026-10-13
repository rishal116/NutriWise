import { z } from "zod";

import { MeetingType } from "@/enums/nutritionist/meeting/meeting.enum";

export const createMeetingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must not exceed 120 characters"),

  userId: z.string().trim().min(1, "Please select a client"),

  scheduledAt: z
    .string()
    .min(1, "Please choose a date and time")
    .refine((value) => {
      const timestamp = new Date(value).getTime();
      return Number.isFinite(timestamp);
    }, "Please enter a valid date and time")
    .refine((value) => {
      const timestamp = new Date(value).getTime();
      return Number.isFinite(timestamp) && timestamp > Date.now();
    }, "Session time must be in the future"),

  durationInMinutes: z
    .number({
      error: "Duration must be a number",
    })
    .int("Duration must be a whole number")
    .min(5, "Minimum duration is 5 minutes")
    .max(240, "Maximum duration is 240 minutes"),

  type: z.nativeEnum(MeetingType, {
    error: "Please select a valid session type",
  }),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>;
