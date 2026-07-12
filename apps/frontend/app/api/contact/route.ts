import { NextResponse } from "next/server";
import { z } from "zod";

const contactRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company_name: z.string().min(2),
  fleet_size: z.string().optional(),
  topic: z.enum([
    "Product question",
    "Pricing",
    "Account help",
    "Partnership",
    "Other"
  ]),
  message: z.string().min(20)
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = contactRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { detail: "Please review the contact form fields and try again." },
      { status: 400 }
    );
  }

  console.info("Toro contact form submission", parsed.data);

  return NextResponse.json({
    message: "Message received. Toro will follow up from the current support path."
  });
}
