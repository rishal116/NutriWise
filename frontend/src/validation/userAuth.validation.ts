import { z } from "zod";

export const UserSignupSchema = z.object({
  fullName:
  z.string()
  .min(3, "Full name must be at least 3 characters")
  .max(50, "Full name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone:
  z.string()
  .regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  password:
  z.string()
  .min(8, "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,"Password must include at least one uppercase, one lowercase, one number, and one special character."),
  confirmPassword: z.string().min(8, "Please confirm your password"),})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UserLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
});

export type UserLoginType = z.infer<typeof UserLoginSchema>;

export type UserSignupType = z.infer<typeof UserSignupSchema>;
