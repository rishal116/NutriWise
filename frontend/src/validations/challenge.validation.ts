import { z } from "zod";

export const createChallengeSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    duration: z.number().min(1),
    difficulty: z.enum(["easy", "medium", "hard"]),
    type: z.enum(["fitness", "nutrition", "mental", "hybrid", "productivity", "recovery"]),
    category: z.enum([
      "weight_loss",
      "muscle_gain",
      "mental_wellness",
      "hydration",
      "productivity",
      "custom",
    ]),
    customCategory: z.string().optional(),
    tags: z.array(z.string()).optional(),
    estimatedCaloriesBurn: z.number().min(0).optional(),
    isPremium: z.boolean(),
    coverImage: z
      .string()
      .url("Invalid cover image URL")
      .optional()
      .or(z.literal("")),
    bannerImage: z
      .string()
      .url("Invalid banner image URL")
      .optional()
      .or(z.literal("")),
    introVideo: z
      .string()
      .url("Invalid intro video URL")
      .optional()
      .or(z.literal("")),
    isFeatured: z.boolean(),
    isTrending: z.boolean(),
    isRecommended: z.boolean(),
    visibility: z.enum(["public", "private"]),
    benefits: z.array(z.string()).optional(),
    equipmentNeeded: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category === "custom") {
      if (!data.customCategory?.trim()) {
        ctx.addIssue({
          path: ["customCategory"],
          code: z.ZodIssueCode.custom,
          message: "Custom category is required",
        });
      }
    }
  });

