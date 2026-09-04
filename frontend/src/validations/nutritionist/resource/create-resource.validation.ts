import { z } from "zod";

import {
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
} from "@/types/nutritionist/resource/resource.types";

const MAX_PDF_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

const ALLOWED_PDF_TYPE = "application/pdf";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

    category: z.enum(RESOURCE_CATEGORIES, {
      message: "Category is required",
    }),

    isDownloadable: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // --------------------------------------------------
    // Article
    // --------------------------------------------------
    if (data.type === "article") {
      if (!data.content || data.content.trim().length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["content"],
          message: "Article content must be at least 20 characters",
        });
      }

      if (data.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: "Article resources must not contain a main file",
        });
      }
    }

    // --------------------------------------------------
    // PDF
    // --------------------------------------------------
    if (data.type === "pdf") {
      if (!data.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: "Upload a PDF file",
        });
      } else {
        if (data.file.type !== ALLOWED_PDF_TYPE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["file"],
            message: "Only PDF files are allowed",
          });
        }

        if (data.file.size > MAX_PDF_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["file"],
            message: "PDF file size must not exceed 10 MB",
          });
        }
      }
    }

    // --------------------------------------------------
    // Video
    // --------------------------------------------------
    if (data.type === "video") {
      if (!data.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: "Upload a video file",
        });
      } else {
        if (!ALLOWED_VIDEO_TYPES.includes(data.file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["file"],
            message: "Only MP4 and WebM video files are allowed",
          });
        }

        if (data.file.size > MAX_VIDEO_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["file"],
            message: "Video file size must not exceed 100 MB",
          });
        }
      }
    }

    // --------------------------------------------------
    // Infographic
    // --------------------------------------------------
    if (data.type === "infographic") {
      if (!data.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: "Upload an image",
        });
      } else {
        if (!ALLOWED_IMAGE_TYPES.includes(data.file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["file"],
            message: "Only JPG, PNG, and WebP images are allowed",
          });
        }

        if (data.file.size > MAX_IMAGE_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["file"],
            message: "Infographic file size must not exceed 10 MB",
          });
        }
      }
    }

    // --------------------------------------------------
    // Thumbnail
    // --------------------------------------------------
    if (data.thumbnail) {
      if (!ALLOWED_IMAGE_TYPES.includes(data.thumbnail.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["thumbnail"],
          message: "Thumbnail must be a JPG, PNG, or WebP image",
        });
      }

      if (data.thumbnail.size > MAX_THUMBNAIL_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["thumbnail"],
          message: "Thumbnail size must not exceed 5 MB",
        });
      }
    }
  });

export type CreateResourceFormValues = z.infer<typeof createResourceSchema>;
