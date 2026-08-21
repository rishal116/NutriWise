import { z } from "zod";

import { MeetingType } from "@/enums/nutritionist/meeting/meeting.enum";

export const createMeetingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title is too long"),

  userId: z.string().trim().min(1, "Please select a client"),

  scheduledAt: z
    .string()
    .min(1, "Please choose a date and time")
    .refine(
      (val) => {
        const date = new Date(val);

        return !Number.isNaN(date.getTime());
      },
      {
        message: "Please enter a valid date and time",
      },
    )
    .refine((val) => new Date(val).getTime() > Date.now(), {
      message: "Session time must be in the future",
    }),

  durationInMinutes: z
    .number("Duration must be a number")
    .int("Duration must be a whole number")
    .min(5, "Minimum duration is 5 minutes")
    .max(240, "Maximum duration is 240 minutes"),

  type: z.nativeEnum(MeetingType),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>;
