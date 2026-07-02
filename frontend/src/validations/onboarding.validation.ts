import { z } from "zod";

export const completeProfileSchema = z.object({
  gender: z.enum(["male", "female", "other"], {
    message: "Please select your gender.",
  }),

  birthDate: z
    .string()
    .min(1, "Please select your birth date."),

  heightCm: z
    .number({
      error: "Please enter your height.",
    })
    .min(50, "Height must be at least 50 cm.")
    .max(300, "Height cannot exceed 300 cm."),

  weightKg: z
    .number({
      error: "Please enter your weight.",
    })
    .min(10, "Weight must be at least 10 kg.")
    .max(500, "Weight cannot exceed 500 kg."),

  activityLevel: z.enum(
    [
      "sedentary",
      "lightly_active",
      "moderately_active",
      "active",
      "very_active",
    ],
    {
      message: "Please select your activity level.",
    },
  ),

  dietType: z.enum(
    ["veg", "non_veg", "vegan", "eggetarian"],
    {
      message: "Please select your diet preference.",
    },
  ),

  goal: z.enum(
    [
      "fitness_weight_loss",
      "fitness_weight_gain",
      "muscle_build",
      "medical_diabetes",
      "medical_pcos",
      "lifestyle_general",
      "mental_wellness",
    ],
    {
      message: "Please select your primary goal.",
    },
  ),

  targetWeightKg: z
    .number({
      error: "Please enter your target weight.",
    })
    .min(10, "Target weight must be at least 10 kg.")
    .max(500, "Target weight cannot exceed 500 kg.")
    .optional(),

  preferredTimeline: z.enum(
    [
      "4_weeks",
      "8_weeks",
      "12_weeks",
      "16_weeks",
      "20_weeks",
      "24_weeks",
    ],
    {
      message: "Please select your preferred timeline.",
    },
  ),
});

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;