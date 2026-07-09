"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyInformation, CompanyMember } from "@/lib/company";
import { updateCurrentCompany } from "@/lib/company";
import {
  companySettingsSchema,
  type CompanySettingsValues
} from "@/lib/validations/company";

type CompanySettingsViewProps = {
  company: CompanyInformation;
  isOwner: boolean;
  members: CompanyMember[];
};

export function CompanySettingsView({
  company,
  isOwner,
  members
}: CompanySettingsViewProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      legal_name: company.legal_name,
      trade_name: company.trade_name ?? "",
      billing_email: company.billing_email ?? "",
      address_line1: company.address_line1 ?? "",
      address_line2: company.address_line2 ?? "",
      city: company.city ?? "",
      state: company.state ?? "",
      postal_code: company.postal_code ?? "",
      invoice_prefix: company.invoice_prefix,
      payment_terms_label: company.payment_terms_label,
      payment_terms_days: company.payment_terms_days
    }
  });

  async function onSubmit(values: CompanySettingsValues) {
    setError(null);
    setSuccess(null);

    try {
      await updateCurrentCompany({
        ...values,
        trade_name: values.trade_name || null,
        billing_email: values.billing_email || null,
        address_line1: values.address_line1 || null,
        address_line2: values.address_line2 || null,
        city: values.city || null,
        state: values.state || null,
        postal_code: values.postal_code || null
      });
      setSuccess("Company settings updated.");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update company settings"
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#161616]">Company</h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Manage company information, invoice settings, and members.
        </p>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
              Company Information
            </h2>
            <div className="mt-5 space-y-4">
              <CompanyField form={form} id="legal_name" label="Legal Name" />
              <CompanyField form={form} id="trade_name" label="Trade Name" />
              <CompanyField form={form} id="billing_email" label="Billing Email" />
              <CompanyField form={form} id="address_line1" label="Address Line 1" />
              <CompanyField form={form} id="address_line2" label="Address Line 2" />
              <div className="grid gap-4 md:grid-cols-3">
                <CompanyField form={form} id="city" label="City" />
                <CompanyField form={form} id="state" label="State" />
                <CompanyField form={form} id="postal_code" label="Postal Code" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
                Invoice Settings
              </h2>
              <div className="mt-5 space-y-4">
                <CompanyField form={form} id="invoice_prefix" label="Invoice Prefix" />
                <CompanyField
                  form={form}
                  id="payment_terms_label"
                  label="Payment Terms Label"
                />
                <CompanyField
                  form={form}
                  id="payment_terms_days"
                  label="Payment Terms Days"
                  type="number"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
                Members
              </h2>
              <div className="mt-5 space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl border border-[#EAEAEA] bg-white px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#161616]">
                        {member.full_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#EAEAEA] bg-[#FAFAFA] px-3 py-1 text-xs font-medium text-[#161616]">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-green-700">{success}</p> : null}

        <Button
          type="submit"
          disabled={!isOwner || form.formState.isSubmitting}
          className="bg-[#161616] text-white hover:bg-[#161616]/90"
        >
          {isOwner ? "Save Changes" : "Owner access required"}
        </Button>
      </form>
    </section>
  );
}

type CompanyFieldProps = {
  form: UseFormReturn<CompanySettingsValues>;
  id: keyof CompanySettingsValues;
  label: string;
  type?: string;
};

function CompanyField({ form, id, label, type = "text" }: CompanyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...form.register(id, { valueAsNumber: type === "number" })} />
      {form.formState.errors[id] ? (
        <p className="text-sm text-red-600">
          {String(form.formState.errors[id]?.message ?? "")}
        </p>
      ) : null}
    </div>
  );
}
