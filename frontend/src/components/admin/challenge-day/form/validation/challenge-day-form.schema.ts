
import { z } from "zod";

import {
  CHALLENGE_ACTIVITY_TYPES,
  CHALLENGE_ACTIVITY_VALUE_TYPES,
} from "@/types/admin/challenge-day/challenge-day.types";

import type {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "@/types/admin/challenge-day/challenge-day.types";

const fileSchema = z.custom<File | null>(
  (value) =>
    value === null ||
    (typeof File !== "undefined" && value instanceof File),
  "Invalid file",
);

const activityTypeSchema = z.string().transform((value, context) => {
  if (!CHALLENGE_ACTIVITY_TYPES.includes(value as ChallengeActivityType)) {
    context.addIssue({
      code: "custom",
      message: "Select an activity type.",
    });

    return z.NEVER;
  }

  return value as ChallengeActivityType;
});

const activityValueTypeSchema = z.string().transform((value, context) => {
  if (
    !CHALLENGE_ACTIVITY_VALUE_TYPES.includes(
      value as ChallengeActivityValueType,
    )
  ) {
    context.addIssue({
      code: "custom",
      message: "Select a value type.",
    });

    return z.NEVER;
  }

  return value as ChallengeActivityValueType;
});

const activitySchema = z
  .object({
    id: z.string().optional(),

    type: activityTypeSchema,

    title: z
      .string()
      .trim()
      .min(1, "Activity title is required")
      .max(150, "Activity title must not exceed 150 characters"),

    description: z.string().trim().max(2000),

    instructions: z.string().trim().max(5000),

    valueType: activityValueTypeSchema,

    targetValue: z
      .number()
      .finite()
      .min(0, "Target value cannot be negative")
      .optional(),

    maxValue: z
      .number()
      .finite()
      .min(0, "Maximum value cannot be negative")
      .optional(),

    unit: z.string().trim().max(30),

    estimatedDurationMinutes: z
      .number()
      .int()
      .min(1, "Duration must be at least 1 minute")
      .max(1440, "Duration cannot exceed 1440 minutes")
      .optional(),

    isRequired: z.boolean(),

    imageFile: fileSchema,
    videoFile: fileSchema,

    existingImageUrl: z.string().optional(),
    existingVideoUrl: z.string().optional(),

    removeImage: z.boolean(),
    removeVideo: z.boolean(),
  })
  .refine(
    (activity) =>
      activity.targetValue === undefined ||
      activity.maxValue === undefined ||
      activity.targetValue <= activity.maxValue,
    {
      message: "Maximum value must be greater than or equal to target value.",
      path: ["maxValue"],
    },
  )
  .refine(
    (activity) =>
      activity.valueType !== "boolean" ||
      (activity.targetValue === undefined &&
        activity.maxValue === undefined &&
        activity.unit.trim() === ""),
    {
      message: "Boolean activities cannot have numeric targets or units.",
      path: ["valueType"],
    },
  );

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

export type FormInput = z.input<typeof challengeDayFormSchema>;
export type FormValues = z.output<typeof challengeDayFormSchema>;
