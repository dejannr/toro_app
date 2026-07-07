import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

export const registerSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required").max(100),
    last_name: z.string().trim().min(1, "Last name is required").max(100),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password")
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(16, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const companyOnboardingSchema = z.object({
  legal_name: z.string().trim().min(1, "Legal company name is required").max(160),
  trade_name: z.string().trim().max(160).optional().or(z.literal(""))
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type CompanyOnboardingValues = z.infer<typeof companyOnboardingSchema>;
