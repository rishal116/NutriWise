import { z } from "zod";

import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
} from "@/types/nutritionist/resource/resource.types";

export const createResourceSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(1000),

    type: z.enum(RESOURCE_TYPES),

    content: z.string().trim().optional(),

    file: z.instanceof(globalThis.File).optional(),

    thumbnail: z.instanceof(globalThis.File).optional(),

    externalUrl: z
      .string()
      .trim()
      .url("Enter a valid URL")
      .optional()
      .or(z.literal("")),

    category: z.enum(RESOURCE_CATEGORIES, {
      message: "Category is required",
    }),

    isDownloadable: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "article" &&
      (!data.content || data.content.trim().length < 20)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content"],
        message: "Article content must be at least 20 characters",
      });
    }

    if (data.type === "pdf" && !data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Upload a PDF file",
      });
    }

    if (data.type === "infographic" && !data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Upload an image",
      });
    }

    if (data.type === "video" && !data.file && !data.externalUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Upload a video file or provide an external URL",
      });
    }

    if (data.type === "external_link" && !data.externalUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["externalUrl"],
        message: "External URL is required",
      });
    }
  });

export type CreateResourceFormValues = z.infer<typeof createResourceSchema>;
