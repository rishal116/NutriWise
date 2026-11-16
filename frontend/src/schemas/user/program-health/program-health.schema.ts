
import { z } from "zod";

import { ACTIVITY_LEVELS } from "@/constants/user/health/activity-level.constants";
import { DIET_TYPES } from "@/constants/user/health/diet-type.constants";

export const programHealthSchema = z.object({
  heightCm: z.string().min(1, "Height is required"),
  currentWeightKg: z.string().min(1, "Current weight is required"),
  targetWeightKg: z.string(),

  activityLevel: z
    .enum(["", ...ACTIVITY_LEVELS])
    .refine((value) => value !== "", "Please select an activity level"),

  dietType: z
    .enum(["", ...DIET_TYPES])
    .refine((value) => value !== "", "Please select a diet type"),

  medicalConditions: z.string().max(1000),
  allergies: z.string().max(1000),
  dietaryRestrictions: z.string().max(1000),
  foodPreferences: z.string().max(1000),
  dislikedFoods: z.string().max(1000),

  mealsPerDay: z.string(),
  dailyWaterIntakeLiters: z.string(),
  averageSleepHours: z.string(),
  additionalNotes: z.string().max(2000),
});

export type ProgramHealthFormValues = z.infer<typeof programHealthSchema>;
