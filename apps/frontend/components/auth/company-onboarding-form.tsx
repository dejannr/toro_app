"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCompanyOnboarding } from "@/lib/auth";
import {
  companyOnboardingSchema,
  type CompanyOnboardingValues
} from "@/lib/validations/auth";

export function CompanyOnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<CompanyOnboardingValues>({
    resolver: zodResolver(companyOnboardingSchema),
    defaultValues: {
      legal_name: "",
      trade_name: ""
    }
  });

  async function onSubmit(values: CompanyOnboardingValues) {
    setError(null);
    try {
      await createCompanyOnboarding(values);
      router.push("/app/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create company");
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="legal_name">Legal company name</Label>
        <Input
          id="legal_name"
          placeholder="Enter legal company name"
          {...form.register("legal_name")}
        />
        {form.formState.errors.legal_name ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.legal_name.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="trade_name">Trade name</Label>
        <Input
          id="trade_name"
          placeholder="Optional"
          {...form.register("trade_name")}
        />
        {form.formState.errors.trade_name ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.trade_name.message}
          </p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        className="w-full bg-[#161616] text-white hover:bg-[#161616]/90"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        Continue to dashboard
      </Button>
    </form>
  );
}
