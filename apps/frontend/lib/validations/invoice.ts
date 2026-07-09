import { z } from "zod";

export const invoiceReviewSchema = z
  .object({
    invoice_number: z.string().trim().min(1, "Invoice number is required").max(40),
    broker_name: z.string().trim().min(1, "Broker name is required").max(160),
    broker_address: z.string().trim().max(320).optional().or(z.literal("")),
    broker_email: z
      .string()
      .trim()
      .email("Enter a valid email")
      .optional()
      .or(z.literal("")),
    load_number: z.string().trim().min(1, "Load number is required").max(80),
    pickup: z.string().trim().min(1, "Pickup is required").max(160),
    delivery: z.string().trim().min(1, "Delivery is required").max(160),
    pickup_date: z.string().min(1, "Pickup date is required"),
    delivery_date: z.string().min(1, "Delivery date is required"),
    linehaul: z.coerce.number().min(0),
    additional_charges: z.coerce.number().min(0),
    total: z.coerce.number().min(0),
    due_date: z.string().min(1, "Due date is required"),
    payment_terms: z.string().trim().min(1, "Payment terms are required").max(80),
    bol_filename: z.string().trim().min(1),
    rate_confirmation_filename: z.string().trim().min(1)
  })
  .refine(
    (values) =>
      Number((values.linehaul + values.additional_charges).toFixed(2)) ===
      Number(values.total.toFixed(2)),
    {
      message: "Total must match linehaul plus additional charges",
      path: ["total"]
    }
  );

export type InvoiceReviewValues = z.infer<typeof invoiceReviewSchema>;
