import { z } from "zod";

export const accountProfileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100),
  phone_number: z.string().trim().max(40).optional().or(z.literal("")),
  job_title: z.string().trim().max(100).optional().or(z.literal(""))
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm the new password")
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"]
  });

export type AccountProfileValues = z.infer<typeof accountProfileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
