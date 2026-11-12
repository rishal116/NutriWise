import { z } from "zod";

import { PROGRAM_ACTIVITY_CATEGORIES } from "@/constants/user/program/program-activity-category.constants";
import { ACTIVITY_VALUE_TYPES } from "@/constants/user/program/activity-value-type.constants";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const requiredCategory = z
  .enum(PROGRAM_ACTIVITY_CATEGORIES)
  .optional()
  .refine(
    (value): value is (typeof PROGRAM_ACTIVITY_CATEGORIES)[number] =>
      value !== undefined,
    "Select a category",
  );

const requiredValueType = z
  .enum(ACTIVITY_VALUE_TYPES)
  .optional()
  .refine(
    (value): value is (typeof ACTIVITY_VALUE_TYPES)[number] =>
      value !== undefined,
    "Select a response type",
  );

const optionalPositiveNumber = z.preprocess((value: unknown) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return Number(value);
}, z.number().positive("Must be greater than zero").optional());

const optionalPositiveInteger = z.preprocess((value: unknown) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return Number(value);
}, z.number().int("Must be a whole number").positive("Must be greater than zero").optional());

const optionalTime = z.preprocess((value: unknown) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return value;
}, z.string().regex(TIME_REGEX, "Use HH:mm format").optional());

export const planActivitySchema = z.object({
  category: requiredCategory,
  title: z.string().trim().min(1, "Activity title is required").max(150),
  description: z.string().trim().max(2000).optional(),
  instructions: z.string().trim().max(5000).optional(),
  valueType: requiredValueType,
  targetValue: optionalPositiveNumber,
  unit: z.string().trim().max(30).optional(),
  estimatedDurationMinutes: optionalPositiveInteger,
  scheduledTime: optionalTime,
  isRequired: z.boolean(),
  order: z.number().int().min(0),
});

export const createPlanDaySchema = z.object({
  dayNumber: z.coerce
    .number()
    .int("Day number must be a whole number")
    .min(1, "Day number must be at least 1"),
  title: z
    .string()
    .trim()
    .max(120, "Title cannot exceed 120 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  activities: z
    .array(planActivitySchema)
    .min(1, "Add at least one activity for this day"),
});

export type CreatePlanDayFormInput = z.input<typeof createPlanDaySchema>;

export type CreatePlanDayFormValues = z.output<typeof createPlanDaySchema>;

export type PlanActivityFormInput =
  CreatePlanDayFormInput["activities"][number];
