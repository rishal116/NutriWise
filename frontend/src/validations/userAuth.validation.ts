import { z } from "zod";

// ================================
// USER SIGNUP VALIDATION
// ================================
export const UserSignupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be at most 50 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters long"
      )
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        "Password must include uppercase, lowercase, number, and special character"
      ),

    confirmPassword: z
      .string()
      .min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserSignupType = z.infer<typeof UserSignupSchema>;

// ================================
// USER LOGIN VALIDATION
// ================================
export const UserLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long"),
});

export type UserLoginType = z.infer<typeof UserLoginSchema>;