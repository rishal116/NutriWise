import { z } from "zod";

import {
  CHALLENGE_ACTIVITY_TYPES,
  CHALLENGE_ACTIVITY_VALUE_TYPES,
} from "@/types/admin/challenge-day/challenge-day.types";

const activitySchema = z.object({
  id: z.string().optional(),
  type: z.enum(CHALLENGE_ACTIVITY_TYPES),
  title: z.string().trim().min(1, "Activity title is required").max(150),
  description: z.string().trim().max(2000),
  instructions: z.string().trim().max(5000),
  valueType: z.enum(CHALLENGE_ACTIVITY_VALUE_TYPES),
  targetValue: z.number().min(0, "Target value cannot be negative").optional(),
  unit: z.string().trim().max(30),
  estimatedDurationMinutes: z.number().min(0).optional(),
  isRequired: z.boolean(),
  configuration: z.record(z.string(), z.unknown()),
  imageFile: z.custom<File | null>(),
  videoFile: z.custom<File | null>(),
  existingImageUrl: z.string().optional(),
  existingVideoUrl: z.string().optional(),
  removeImage: z.boolean(),
  removeVideo: z.boolean(),
});

export const challengeDayFormSchema = z.object({
  dayNumber: z.number().int().min(1, "Day number must be at least 1"),
  title: z
    .string()
    .trim()
    .min(1, "Day title is required")
    .max(150, "Day title must not exceed 150 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Day description is required")
    .max(2000, "Day description must not exceed 2000 characters"),
  activities: z
    .array(activitySchema)
    .min(1, "At least one activity is required"),
});

export type FormValues = z.infer<typeof challengeDayFormSchema>;