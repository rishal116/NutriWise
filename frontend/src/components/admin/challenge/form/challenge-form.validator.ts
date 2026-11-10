import { z } from "zod";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
} from "@/types/admin/challenge/challenge.types";

export const challengeFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Challenge title is required.")
    .max(150, "Title cannot exceed 150 characters."),

  description: z
    .string()
    .trim()
    .min(1, "Challenge description is required.")
    .max(3000, "Description cannot exceed 3000 characters."),

  instructions: z
    .string()
    .max(5000, "Instructions cannot exceed 5000 characters."),

  category: z.enum(CHALLENGE_CATEGORIES, {
    message: "Please select a challenge category.",
  }),

  difficulty: z.enum(CHALLENGE_DIFFICULTIES, {
    message: "Please select a challenge difficulty.",
  }),

  accessType: z.enum(CHALLENGE_ACCESS_TYPES, {
    message: "Please select an access type.",
  }),

  durationDays: z
    .number()
    .int("Duration must be a whole number.")
    .min(1, "Duration must be at least 1 day.")
    .max(365, "Duration cannot exceed 365 days."),

  goals: z
    .array(z.string().trim().min(1, "Goal cannot be empty."))
    .min(1, "At least one challenge goal is required."),

  benefits: z.array(z.string().trim()),
  tags: z.array(z.string().trim()),
});

export const imageFileSchema = z
  .instanceof(File, { message: "Please select a valid image file." })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    { message: "Only JPG, PNG, and WebP images are supported." },
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image size must be 5 MB or smaller.",
  });
