import { z } from "zod";

export const companySettingsSchema = z.object({
  legal_name: z.string().trim().min(1, "Company name is required").max(160),
  trade_name: z.string().trim().max(160).optional().or(z.literal("")),
  billing_email: z
    .string()
    .trim()
    .email("Enter a valid billing email")
    .optional()
    .or(z.literal("")),
  address_line1: z.string().trim().max(160).optional().or(z.literal("")),
  address_line2: z.string().trim().max(160).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  state: z.string().trim().max(120).optional().or(z.literal("")),
  postal_code: z.string().trim().max(40).optional().or(z.literal("")),
  invoice_prefix: z.string().trim().min(1, "Invoice prefix is required").max(20),
  payment_terms_label: z
    .string()
    .trim()
    .min(1, "Payment terms are required")
    .max(80),
  payment_terms_days: z.coerce
    .number()
    .int("Use a whole number")
    .min(0)
    .max(180)
});

export type CompanySettingsValues = z.infer<typeof companySettingsSchema>;
