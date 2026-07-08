import { z } from "zod";
import { LANGUAGES, SPECIALIZATIONS } from "@/types/nutritionist.types";

const currentYear = new Date().getFullYear();

export const qualificationSchema = z.object({
  degree: z.string().trim().min(2, "Degree is required"),

  institution: z.string().trim().min(2, "Institution is required"),

  year: z.coerce
    .number()
    .min(1950, "Enter a valid year")
    .max(currentYear, "Year cannot be in the future"),
});

export const experienceSchema = z.object({
  role: z.string().trim().min(2, "Role is required"),

  organization: z.string().trim().min(2, "Organization is required"),

  durationYears: z.coerce.number().min(0, "Experience cannot be negative"),
});

export const certificationSchema = z
  .object({
    name: z.string().trim().min(2, "Certification name is required"),

    issuedBy: z.string().trim().min(2, "Issued by is required"),

    // Existing uploaded certificate URL
    fileUrl: z.string().optional(),

    // New uploaded file
    file: z.custom<FileList>().optional(),
  })
  .superRefine((data, ctx) => {
    const hasExistingFile = !!data.fileUrl;

    const hasNewFile = data.file instanceof FileList && data.file.length === 1;

    if (!hasExistingFile && !hasNewFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Certificate file is required",
      });
      return;
    }

    if (hasNewFile && data.file![0].size > 5 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Certificate must be less than 5 MB",
      });
    }
  });

export const nutritionistApplicationSchema = z
  .object({
    qualifications: z
      .array(qualificationSchema)
      .min(1, "At least one qualification is required"),

    experiences: z
      .array(experienceSchema)
      .min(1, "At least one experience is required"),

    specializations: z
      .array(z.enum(SPECIALIZATIONS))
      .min(1, "Select at least one specialization"),

    languages: z
      .array(z.enum(LANGUAGES))
      .min(1, "Select at least one language"),

    bio: z
      .string()
      .trim()
      .max(500, "Bio cannot exceed 500 characters")
      .optional(),

    // Existing resume URL
    resumeUrl: z.string().optional(),

    // Newly uploaded resume
    resume: z.custom<FileList>().optional(),

    certifications: z
      .array(certificationSchema)
      .min(1, "At least one certification is required"),
  })
  .superRefine((data, ctx) => {
    const hasExistingResume = !!data.resumeUrl;

    const hasNewResume =
      data.resume instanceof FileList && data.resume.length === 1;

    if (!hasExistingResume && !hasNewResume) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["resume"],
        message: "Resume is required",
      });
      return;
    }

    if (hasNewResume && data.resume![0].size > 5 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["resume"],
        message: "Resume must be less than 5 MB",
      });
    }
  });

export type NutritionistApplicationFormValues = z.infer<
  typeof nutritionistApplicationSchema
>;
