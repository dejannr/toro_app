"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building05,
  ChevronDown,
  ChevronUp,
  CreditCard02,
  File06,
  Users01
} from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageIntro } from "@/components/layout/page-intro";
import type { CompanyInformation, CompanyMember } from "@/lib/company";
import { updateCurrentCompany } from "@/lib/company";
import {
  companySettingsSchema,
  type CompanySettingsValues
} from "@/lib/validations/company";
import { cn } from "@/lib/utils";

type CompanySettingsViewProps = {
  company: CompanyInformation;
  isOwner: boolean;
  members: CompanyMember[];
};

type CompanyTab = "profile" | "billing" | "invoices" | "team";

type SectionId = "business" | "trucking";

const companyTabs: { id: CompanyTab; label: string }[] = [
  { id: "profile", label: "Company profile" },
  { id: "billing", label: "Billing & remittance" },
  { id: "invoices", label: "Invoice settings" },
  { id: "team", label: "Team" }
];

export function CompanySettingsView({
  company,
  isOwner,
  members
}: CompanySettingsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CompanyTab>("profile");
  const [expandedSection, setExpandedSection] = useState<SectionId | null>("business");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<CompanySettingsValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      legal_name: company.legal_name,
      trade_name: company.trade_name ?? "",
      billing_email: company.billing_email ?? "",
      phone_number: company.phone_number ?? "",
      website: company.website ?? "",
      dot_number: company.dot_number ?? "",
      mc_number: company.mc_number ?? "",
      ein_number: company.ein_number ?? "",
      address_line1: company.address_line1 ?? "",
      address_line2: company.address_line2 ?? "",
      city: company.city ?? "",
      state: company.state ?? "",
      postal_code: company.postal_code ?? "",
      remittance_name: company.remittance_name ?? "",
      remittance_address_line1: company.remittance_address_line1 ?? "",
      remittance_address_line2: company.remittance_address_line2 ?? "",
      remittance_city: company.remittance_city ?? "",
      remittance_state: company.remittance_state ?? "",
      remittance_postal_code: company.remittance_postal_code ?? "",
      invoice_prefix: company.invoice_prefix,
      payment_terms_label: company.payment_terms_label,
      payment_terms_days: company.payment_terms_days
    }
  });

  const ownerLabel = useMemo(
    () => (isOwner ? "Owner access" : "Owner access required"),
    [isOwner]
  );

  async function onSubmit(values: CompanySettingsValues) {
    setError(null);
    setSuccess(null);

    try {
      await updateCurrentCompany({
        legal_name: values.legal_name,
        trade_name: values.trade_name || null,
        billing_email: values.billing_email || null,
        phone_number: values.phone_number || null,
        website: values.website || null,
        dot_number: values.dot_number || null,
        mc_number: values.mc_number || null,
        ein_number: values.ein_number || null,
        address_line1: values.address_line1 || null,
        address_line2: values.address_line2 || null,
        city: values.city || null,
        state: values.state || null,
        postal_code: values.postal_code || null,
        remittance_name: values.remittance_name || null,
        remittance_address_line1: values.remittance_address_line1 || null,
        remittance_address_line2: values.remittance_address_line2 || null,
        remittance_city: values.remittance_city || null,
        remittance_state: values.remittance_state || null,
        remittance_postal_code: values.remittance_postal_code || null,
        invoice_prefix: values.invoice_prefix,
        payment_terms_label: values.payment_terms_label,
        payment_terms_days: values.payment_terms_days
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
      <PageIntro
        title="Company settings"
        description="Maintain the legal, operational, remittance, and invoice details used by your company."
        sticky
        actions={
          activeTab !== "team" ? (
            <Button
              type="submit"
              form="company-settings-form"
              disabled={!isOwner || form.formState.isSubmitting}
              className="bg-[#161616] text-white hover:bg-[#222222]"
            >
              {isOwner ? "Save changes" : "Owner access required"}
            </Button>
          ) : null
        }
      />

      <div className="border-b border-[#EFEFEF]">
        <div className="flex flex-wrap gap-6">
          {companyTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "border-b-2 pb-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[#FFD028] text-[#161616]"
                    : "border-transparent text-[#8A8A8A] hover:text-[#161616]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <form
        id="company-settings-form"
        className="space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {activeTab === "profile" ? (
          <div className="space-y-4">
            <SectionCard
              title="Business profile"
              description="Legal and contact details commonly used across contracts and carrier paperwork."
              icon={Building05}
              expanded={expandedSection === "business"}
              onToggle={() =>
                setExpandedSection((current) =>
                  current === "business" ? null : "business"
                )
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <CompanyField form={form} id="legal_name" label="Legal business name" />
                <CompanyField form={form} id="trade_name" label="DBA / trade name" />
                <CompanyField
                  form={form}
                  id="billing_email"
                  label="Billing email"
                  type="email"
                />
                <CompanyField
                  form={form}
                  id="phone_number"
                  label="Main phone number"
                />
                <CompanyField form={form} id="website" label="Website" />
                <div />
                <CompanyField
                  form={form}
                  id="address_line1"
                  label="Street address"
                  className="md:col-span-2"
                />
                <CompanyField
                  form={form}
                  id="address_line2"
                  label="Street address line 2"
                  className="md:col-span-2"
                />
                <CompanyField form={form} id="city" label="City" />
                <CompanyField form={form} id="state" label="State" />
                <CompanyField form={form} id="postal_code" label="ZIP / postal code" />
              </div>
            </SectionCard>

            <SectionCard
              title="Trucking identifiers"
              description="Core carrier identifiers typically required on rate confirmations and invoices."
              icon={File06}
              expanded={expandedSection === "trucking"}
              onToggle={() =>
                setExpandedSection((current) =>
                  current === "trucking" ? null : "trucking"
                )
              }
            >
              <div className="grid gap-4 md:grid-cols-3">
                <CompanyField form={form} id="dot_number" label="USDOT number" />
                <CompanyField form={form} id="mc_number" label="MC number" />
                <CompanyField form={form} id="ein_number" label="EIN / Tax ID" />
              </div>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "billing" ? (
          <SectionPanel
            icon={CreditCard02}
            title="Billing & remittance"
            description="Where customers should remit payment if billing and mailing details differ from the main office."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <CompanyField
                form={form}
                id="remittance_name"
                label="Remittance payee name"
                className="md:col-span-2"
              />
              <CompanyField
                form={form}
                id="remittance_address_line1"
                label="Remittance address"
                className="md:col-span-2"
              />
              <CompanyField
                form={form}
                id="remittance_address_line2"
                label="Remittance address line 2"
                className="md:col-span-2"
              />
              <CompanyField form={form} id="remittance_city" label="City" />
              <CompanyField form={form} id="remittance_state" label="State" />
              <CompanyField
                form={form}
                id="remittance_postal_code"
                label="ZIP / postal code"
              />
            </div>
          </SectionPanel>
        ) : null}

        {activeTab === "invoices" ? (
          <SectionPanel
            icon={File06}
            title="Invoice defaults"
            description="Baseline invoice numbering and payment terms used when new invoices are created."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <CompanyField form={form} id="invoice_prefix" label="Invoice prefix" />
              <CompanyField
                form={form}
                id="payment_terms_label"
                label="Payment terms label"
              />
              <CompanyField
                form={form}
                id="payment_terms_days"
                label="Net days"
                type="number"
              />
            </div>
          </SectionPanel>
        ) : null}

        {activeTab === "team" ? (
          <SectionPanel
            icon={Users01}
            title="Team members"
            description="Accounts currently linked to this company workspace."
          >
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#161616]">
                      {member.full_name}
                    </p>
                    <p className="truncate text-xs text-[#7D7D7D]">{member.email}</p>
                  </div>
                  <span className="rounded-full border border-[#ECECEC] bg-[#FAFAFA] px-3 py-1 text-xs font-medium capitalize text-[#161616]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </SectionPanel>
        ) : null}

        {activeTab !== "team" ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {success ? <p className="text-sm text-[#5C5C5C]">{success}</p> : null}
              {!error && !success ? (
                <p className="text-sm text-[#7D7D7D]">{ownerLabel}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}

type CompanyFieldProps = {
  form: UseFormReturn<CompanySettingsValues>;
  id: keyof CompanySettingsValues;
  label: string;
  type?: string;
  className?: string;
};

function CompanyField({
  form,
  id,
  label,
  type = "text",
  className
}: CompanyFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
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

type SectionPanelProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
};

function SectionPanel({
  icon: Icon,
  title,
  description,
  children
}: SectionPanelProps) {
  return (
    <div className="rounded-[16px] border border-[#E7E7E7] bg-[#FAFAFA] p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#161616]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-[#161616]">{title}</h2>
          <p className="text-sm text-[#6F6F6F]">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

type SectionCardProps = SectionPanelProps & {
  expanded: boolean;
  onToggle: () => void;
};

function SectionCard({
  icon: Icon,
  title,
  description,
  expanded,
  onToggle,
  children
}: SectionCardProps) {
  return (
    <div className="rounded-[16px] border border-[#E7E7E7] bg-[#FAFAFA]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#161616]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-[#161616]">{title}</h2>
            <p className="text-sm text-[#6F6F6F]">{description}</p>
          </div>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#ECECEC] bg-white text-[#6F6F6F]">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>
      {expanded ? <div className="px-5 pb-5">{children}</div> : null}
    </div>
  );
}
