import { z } from "zod";
import {
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
} from "@/types/health/health.types";

export const completeProfileSchema = z.object({
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    message: "Please select your gender.",
  }),
  birthDate: z
    .string()
    .min(1, "Please select your birth date.")
    .refine((value) => {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

      if (!match) {
        return false;
      }

      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);

      const date = new Date(Date.UTC(year, month - 1, day));

      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    }, "Please enter a valid birth date."),
    
  heightCm: z
    .number({ error: "Please enter your height." })
    .min(1, "Height must be at least 1 cm.")
    .max(300, "Height cannot exceed 300 cm."),

  weightKg: z
    .number({ error: "Please enter your weight." })
    .positive("Weight must be greater than 0 kg.")
    .max(700, "Weight cannot exceed 700 kg."),

  activityLevel: z.enum(ACTIVITY_LEVELS, {
    message: "Please select your activity level.",
  }),

  dietType: z.enum(DIET_TYPES, {
    message: "Please select your diet preference.",
  }),

  goal: z.enum(GOALS, {
    message: "Please select your primary goal.",
  }),

  targetWeightKg: z
    .number({ error: "Please enter your target weight." })
    .positive("Target weight must be greater than 0 kg.")
    .max(700, "Target weight cannot exceed 700 kg.")
    .optional(),

  preferredTimeline: z
    .enum(TIMELINES, {
      message: "Please select your preferred timeline.",
    })
    .optional(),
});

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;
