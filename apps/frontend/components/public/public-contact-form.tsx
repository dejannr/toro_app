"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  company_name: z.string().min(2, "Enter a company name."),
  fleet_size: z.string().optional(),
  topic: z.enum([
    "Product question",
    "Pricing",
    "Account help",
    "Partnership",
    "Other"
  ]),
  message: z.string().min(20, "Enter at least 20 characters.")
});

type ContactValues = z.infer<typeof contactSchema>;

const topicOptions = contactSchema.shape.topic.options;

export function PublicContactForm() {
  const [submitState, setSubmitState] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company_name: "",
      fleet_size: "",
      topic: "Product question",
      message: ""
    }
  });

  async function onSubmit(values: ContactValues) {
    setSubmitState({});

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = (await response.json()) as { detail?: string; message?: string };

    if (!response.ok) {
      setSubmitState({ error: payload.detail ?? "Unable to send your message." });
      return;
    }

    form.reset();
    setSubmitState({
      success: payload.message ?? "Message received. Toro will follow up shortly."
    });
  }

  return (
    <form
      className="rounded-[12px] border border-[#EAEAEA] bg-white p-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact-company">Company name</Label>
          <Input id="contact-company" {...form.register("company_name")} />
          {form.formState.errors.company_name ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.company_name.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact-fleet-size">Fleet or company size</Label>
          <Input
            id="contact-fleet-size"
            placeholder="Optional"
            {...form.register("fleet_size")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact-topic">Topic</Label>
          <select
            id="contact-topic"
            className="flex h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none transition-colors focus-visible:border-[#FFD231] focus-visible:ring-2 focus-visible:ring-[#FFD231]/35"
            {...form.register("topic")}
          >
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {form.formState.errors.topic ? (
            <p className="text-sm text-red-600">{form.formState.errors.topic.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact-message">Message</Label>
          <textarea
            id="contact-message"
            rows={6}
            className="w-full rounded-md border border-input bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[#FFD231] focus-visible:ring-2 focus-visible:ring-[#FFD231]/35"
            {...form.register("message")}
          />
          {form.formState.errors.message ? (
            <p className="text-sm text-red-600">{form.formState.errors.message.message}</p>
          ) : null}
        </div>
      </div>

      {submitState.error ? (
        <p className="mt-4 text-sm text-red-600">{submitState.error}</p>
      ) : null}
      {submitState.success ? (
        <p className="mt-4 text-sm text-[#2F9E62]">{submitState.success}</p>
      ) : null}

      <Button
        type="submit"
        className="mt-6 rounded-[10px] bg-[#161616] text-white hover:bg-[#222222]"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
