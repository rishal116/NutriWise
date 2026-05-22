import { z } from "zod";
import {
  ACTIVITY_LEVELS,
  DIET_TYPES,
  GOALS,
  TIMELINES,
} from "@/types/health.types";

export const ClientProfileSchema = z
  .object({
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((val) => {
        const dob = new Date(val);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();

        const monthDiff = today.getMonth() - dob.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }

        return age >= 10 && age <= 100;
      }, {
        message: "Age must be between 10 and 100",
      }),

    gender: z.enum(["male", "female", "other"], {
      message: "Please select gender",
    }),

    heightCm: z
      .string()
      .min(1, "Height is required")
      .refine((val) => Number(val) >= 40, {
        message: "Height must be at least 40 cm",
      }),

    weightKg: z
      .string()
      .min(1, "Weight is required")
      .refine((val) => Number(val) >= 10, {
        message: "Weight must be at least 10 kg",
      }),

    goal: z.enum([...GOALS] as [string, ...string[]], {
      message: "Please select goal",
    }),

    activityLevel: z.enum(
      [...ACTIVITY_LEVELS] as [string, ...string[]],
      {
        message: "Please select activity level",
      }
    ),

    dietType: z.enum([...DIET_TYPES] as [string, ...string[]], {
      message: "Please select diet type",
    }),

    preferredTimeline: z.enum(
      [...TIMELINES] as [string, ...string[]],
      {
        message: "Please select preferred timeline",
      }
    ),

    customTimelineWeeks: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.preferredTimeline === "custom") {
      if (
        !data.customTimelineWeeks ||
        Number(data.customTimelineWeeks) < 1
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["customTimelineWeeks"],
          message: "Enter valid custom timeline weeks",
        });
      }
    }
  });

export type ClientProfileFormData = z.infer<
  typeof ClientProfileSchema
>;