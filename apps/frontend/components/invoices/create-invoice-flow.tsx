"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  File06,
  FileX02,
  XClose,
  UploadCloud02
} from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInvoice, generateInvoiceDraft } from "@/lib/invoices";
import {
  invoiceReviewSchema,
  type InvoiceReviewValues
} from "@/lib/validations/invoice";

type Step = "upload" | "processing" | "review";

const processingMessages = [
  "Uploading documents...",
  "Processing...",
  "Preparing draft invoice..."
];

const PROCESSING_PLACEHOLDER_MS = 20_000;
const PROCESSING_STEP_MS =
  PROCESSING_PLACEHOLDER_MS / processingMessages.length;

const invoiceSteps = [
  { id: "upload", label: "Upload documents" },
  { id: "processing", label: "Process information" },
  { id: "review", label: "Review invoice" }
] as const;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type UploadCardProps = {
  accept: string;
  description: string;
  file: File | null;
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
};

function UploadCard({
  accept,
  description,
  file,
  id,
  label,
  onFileChange
}: UploadCardProps) {
  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-[#FAFAFA] p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-[#161616]">{label}</p>
            <span
              className={
                file
                  ? "inline-flex rounded-full bg-[#EAF8EF] px-2.5 py-1 text-[11px] font-medium text-[#2F9E62]"
                  : "inline-flex rounded-full bg-[#F0F0F0] px-2.5 py-1 text-[11px] font-medium text-[#6B6B6B]"
              }
            >
              {file ? "Ready" : "Required"}
            </span>
          </div>
          <p className="text-sm text-[#6F6F6F]">{description}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white text-[#161616]">
          <File06 className="h-5 w-5" />
        </div>
      </div>

      <label
        htmlFor={id}
        className="mt-5 flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D8D8D8] bg-white px-6 py-10 text-center transition-colors hover:border-[#FFD028]"
      >
        <UploadCloud02 className="h-7 w-7 text-[#161616]" />
        <span className="mt-4 text-sm font-medium text-[#161616]">Browse Files</span>
        <span className="mt-2 text-xs text-muted-foreground">
          Drag &amp; drop or select a file
        </span>
        <span className="mt-3 text-xs text-muted-foreground">{accept}</span>
        <input
          id={id}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="mt-4 rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-[#161616]">
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-[#161616]">{file.name}</p>
              <p className="mt-1 text-xs text-[#7D7D7D]">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF8EF] text-[#2F9E62]">
                <CheckCircle className="h-4 w-4 shrink-0" />
              </span>
              <button
                type="button"
                aria-label={`Remove ${label}`}
                onClick={() => onFileChange(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F3F3] text-[#8A8A8A] transition-colors hover:bg-[#E9E9E9] hover:text-[#161616]"
              >
                <XClose className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <FileX02 className="h-5 w-5 text-[#9A9A9A]" />
            <span className="text-[#7D7D7D]">No file selected</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function CreateInvoiceFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [bolFile, setBolFile] = useState<File | null>(null);
  const [rateConfirmationFile, setRateConfirmationFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<InvoiceReviewValues>({
    resolver: zodResolver(invoiceReviewSchema),
    defaultValues: {
      invoice_number: "",
      broker_name: "",
      broker_address: "",
      broker_email: "",
      load_number: "",
      pickup: "",
      delivery: "",
      pickup_date: "",
      delivery_date: "",
      linehaul: 0,
      additional_charges: 0,
      total: 0,
      due_date: "",
      payment_terms: "",
      bol_filename: "",
      rate_confirmation_filename: ""
    }
  });

  useEffect(() => {
    if (step !== "processing") {
      return;
    }

    const interval = window.setInterval(() => {
      setProcessingIndex((current) =>
        current < processingMessages.length - 1 ? current + 1 : current
      );
    }, PROCESSING_STEP_MS);

    return () => window.clearInterval(interval);
  }, [step]);

  const canGenerate = bolFile !== null && rateConfirmationFile !== null;
  const totalPreview = formatMoney(
    Number(form.watch("linehaul") || 0) +
      Number(form.watch("additional_charges") || 0)
  );

  async function handleGenerate() {
    if (!bolFile || !rateConfirmationFile) {
      setUploadError(
        "Please upload both the Bill of Lading and the Rate Confirmation."
      );
      return;
    }

    setUploadError(null);
    setSubmitError(null);
    setProcessingIndex(0);
    setStep("processing");

    try {
      const [draft] = await Promise.all([
        generateInvoiceDraft(bolFile, rateConfirmationFile),
        wait(PROCESSING_PLACEHOLDER_MS)
      ]);
      form.reset({
        invoice_number: draft.invoice_number,
        broker_name: draft.bill_to.broker_name,
        broker_address: draft.bill_to.address ?? "",
        broker_email: draft.bill_to.email ?? "",
        load_number: draft.load_information.load_number,
        pickup: draft.load_information.pickup,
        delivery: draft.load_information.delivery,
        pickup_date: draft.load_information.pickup_date,
        delivery_date: draft.load_information.delivery_date,
        linehaul: draft.charges.linehaul,
        additional_charges: draft.charges.additional_charges,
        total: draft.charges.total,
        due_date: draft.payment_terms.due_date,
        payment_terms: draft.payment_terms.payment_terms,
        bol_filename: draft.bol_filename,
        rate_confirmation_filename: draft.rate_confirmation_filename
      });
      setStep("review");
    } catch (error) {
      setStep("upload");
      setSubmitError(
        error instanceof Error ? error.message : "Unable to generate draft invoice"
      );
    }
  }

  async function onSubmit(values: InvoiceReviewValues) {
    setSubmitError(null);
    try {
      const invoice = await createInvoice({
        invoice_number: values.invoice_number,
        bill_to: {
          broker_name: values.broker_name,
          address: values.broker_address || null,
          email: values.broker_email || null
        },
        load_information: {
          load_number: values.load_number,
          pickup: values.pickup,
          delivery: values.delivery,
          pickup_date: values.pickup_date,
          delivery_date: values.delivery_date
        },
        charges: {
          linehaul: values.linehaul,
          additional_charges: values.additional_charges,
          total: values.total
        },
        payment_terms: {
          due_date: values.due_date,
          payment_terms: values.payment_terms
        },
        bol_filename: values.bol_filename,
        rate_confirmation_filename: values.rate_confirmation_filename
      });
      router.push(`/app/invoices/${invoice.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create invoice"
      );
    }
  }

  const currentStepIndex =
    step === "upload" ? 0 : step === "processing" ? 1 : 2;

  if (step === "processing") {
    return (
      <section className="w-full space-y-6">
        <PageIntro
          title="Processing draft"
          description="The files are only used to simulate the future invoice workflow."
        />
        <StepProgress currentStepIndex={currentStepIndex} />
        <div className="rounded-[16px] border border-[#E5E5E5] bg-[#FAFAFA] p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD028]/20">
              <div className="h-5 w-5 animate-pulse rounded-full bg-[#FFD028]" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-medium text-[#161616]">
                {processingMessages[processingIndex]}
              </p>
              <p className="text-sm text-[#6F6F6F]">
                This is a mock processing stage for the MVP.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (step === "review") {
    return (
      <section className="w-full space-y-6">
        <PageIntro
          title="Review draft invoice"
          description="The fields are prefilled with mock values for this MVP and can be edited before the invoice is created."
          actions={
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("upload")}
              >
                Back
              </Button>
              <Button
                type="submit"
                form="review-invoice-form"
                className="bg-[#161616] text-white hover:bg-[#161616]/90"
                disabled={form.formState.isSubmitting}
              >
                Create Invoice
              </Button>
            </div>
          }
        />
        <StepProgress currentStepIndex={currentStepIndex} />

        <form
          id="review-invoice-form"
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[16px] border border-[#E5E5E5] bg-[#FAFAFA] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
                Bill To
              </h2>
              <div className="mt-5 space-y-4">
                <Field label="Broker Name" id="broker_name" form={form}>
                  <Input id="broker_name" {...form.register("broker_name")} />
                </Field>
                <Field label="Address" id="broker_address" form={form}>
                  <Input id="broker_address" {...form.register("broker_address")} />
                </Field>
                <Field label="Email" id="broker_email" form={form}>
                  <Input
                    id="broker_email"
                    type="email"
                    {...form.register("broker_email")}
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E5E5E5] bg-[#FAFAFA] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
                Load Information
              </h2>
              <div className="mt-5 space-y-4">
                <Field label="Invoice #" id="invoice_number" form={form}>
                  <Input id="invoice_number" {...form.register("invoice_number")} />
                </Field>
                <Field label="Load Number" id="load_number" form={form}>
                  <Input id="load_number" {...form.register("load_number")} />
                </Field>
                <Field label="Pickup" id="pickup" form={form}>
                  <Input id="pickup" {...form.register("pickup")} />
                </Field>
                <Field label="Delivery" id="delivery" form={form}>
                  <Input id="delivery" {...form.register("delivery")} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Pickup Date" id="pickup_date" form={form}>
                    <Input
                      id="pickup_date"
                      type="date"
                      {...form.register("pickup_date")}
                    />
                  </Field>
                  <Field label="Delivery Date" id="delivery_date" form={form}>
                    <Input
                      id="delivery_date"
                      type="date"
                      {...form.register("delivery_date")}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[16px] border border-[#E5E5E5] bg-[#FAFAFA] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
                Charges
              </h2>
              <div className="mt-5 space-y-4">
                <Field label="Linehaul" id="linehaul" form={form}>
                  <Input
                    id="linehaul"
                    type="number"
                    step="0.01"
                    {...form.register("linehaul", { valueAsNumber: true })}
                  />
                </Field>
                <Field
                  label="Additional Charges"
                  id="additional_charges"
                  form={form}
                >
                  <Input
                    id="additional_charges"
                    type="number"
                    step="0.01"
                    {...form.register("additional_charges", {
                      valueAsNumber: true
                    })}
                  />
                </Field>
                <Field label="Total" id="total" form={form}>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    {...form.register("total", { valueAsNumber: true })}
                  />
                </Field>
                <div className="rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Preview
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#161616]">
                    {totalPreview}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E5E5E5] bg-[#FAFAFA] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
                Payment Terms
              </h2>
              <div className="mt-5 space-y-4">
                <Field label="Due Date" id="due_date" form={form}>
                  <Input
                    id="due_date"
                    type="date"
                    {...form.register("due_date")}
                  />
                </Field>
                <Field label="Payment Terms" id="payment_terms" form={form}>
                  <Input
                    id="payment_terms"
                    {...form.register("payment_terms")}
                  />
                </Field>
                <div className="rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3 text-sm text-muted-foreground">
                  Files: {form.watch("bol_filename")} and{" "}
                  {form.watch("rate_confirmation_filename")}
                </div>
              </div>
            </div>
          </div>

          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
        </form>
      </section>
    );
  }

  return (
    <section className="w-full space-y-6">
      <PageIntro
        title="Create invoice"
        description="Upload the Bill of Lading and Rate Confirmation. The MVP uses those files to simulate the future workflow and prefill a reviewable draft."
        actions={
          <Button
            className="bg-[#161616] text-white hover:bg-[#161616]/90"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            Generate Invoice
          </Button>
        }
      />
      <StepProgress currentStepIndex={currentStepIndex} />

      <div className="grid gap-6 xl:grid-cols-2">
        <UploadCard
          accept="Accepted: PDF, JPG, PNG"
          description="Carrier proof of delivery and shipment details."
          file={bolFile}
          id="bol-file"
          label="Bill of Lading (BOL)"
          onFileChange={setBolFile}
        />
        <UploadCard
          accept="Accepted: PDF, JPG, PNG"
          description="Broker pricing, terms, and load confirmation."
          file={rateConfirmationFile}
          id="rate-confirmation-file"
          label="Rate Confirmation"
          onFileChange={setRateConfirmationFile}
        />
      </div>

      {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
    </section>
  );
}

type FieldProps = {
  children: ReactNode;
  form: UseFormReturn<InvoiceReviewValues>;
  id: keyof InvoiceReviewValues;
  label: string;
};

function Field({ children, form, id, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {form.formState.errors[id] ? (
        <p className="text-sm text-red-600">
          {String(form.formState.errors[id]?.message ?? "")}
        </p>
      ) : null}
    </div>
  );
}

type StepProgressProps = {
  currentStepIndex: number;
};

function StepProgress({ currentStepIndex }: StepProgressProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-6">
      {invoiceSteps.map((stepItem, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <div key={stepItem.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span
                className="text-sm font-medium text-[#161616]"
              >
                {index + 1} of {invoiceSteps.length}
              </span>
              <span
                className={
                  isActive || isCompleted
                    ? "text-sm font-normal text-[#8A8A8A]"
                    : "text-sm font-normal text-[#8A8A8A]"
                }
              >
                {stepItem.label}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E9E9E9]">
              <div
                className={
                  isCompleted || isActive
                    ? "h-full rounded-full bg-[#FFD028]"
                    : "h-full rounded-full bg-transparent"
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
