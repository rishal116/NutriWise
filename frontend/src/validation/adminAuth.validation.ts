import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .nonempty("Password is required")
    .refine(
      (value) =>
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value),
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
    ),
});



export const adminForgotSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email"),
});

export type AdminLoginDTO = z.infer<typeof adminLoginSchema>;
export type AdminForgotDTO = z.infer<typeof adminForgotSchema>;
