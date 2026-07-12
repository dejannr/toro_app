"use client";

import { Download01, Mail01, Trash03, Wallet03 } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageIntro } from "@/components/layout/page-intro";
import { Button } from "@/components/ui/button";
import {
  deleteInvoice,
  getInvoiceDownloadUrl,
  markInvoicePaid,
  sendInvoiceEmail,
  type InvoiceDetails
} from "@/lib/invoices";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

type InvoiceDetailViewProps = {
  invoice: InvoiceDetails;
};

export function InvoiceDetailView({ invoice: initialInvoice }: InvoiceDetailViewProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState(initialInvoice);
  const [emailPreview, setEmailPreview] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSendEmail() {
    setError(null);
    setIsSending(true);
    try {
      const response = await sendInvoiceEmail(invoice.id);
      setEmailPreview(response.fake_email);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send email");
    } finally {
      setIsSending(false);
    }
  }

  async function handleMarkPaid() {
    setError(null);
    setIsPaying(true);
    try {
      const response = await markInvoicePaid(invoice.id);
      setInvoice(response);
    } catch (payError) {
      setError(payError instanceof Error ? payError.message : "Unable to mark paid");
    } finally {
      setIsPaying(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete invoice ${invoice.invoice_number}? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);
    try {
      await deleteInvoice(invoice.id);
      router.push("/app/invoices");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to delete invoice"
      );
      setIsDeleting(false);
    }
  }

  return (
    <section className="space-y-6">
      <PageIntro
        title={`Invoice ${invoice.invoice_number}`}
        description={`${invoice.customer_name} · Load ${invoice.load_number}`}
        actions={
          <span className="inline-flex rounded-full border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-2 text-sm font-medium text-[#161616]">
            {invoice.status}
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
              Bill To
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Detail label="Broker Name" value={invoice.customer_name} />
              <Detail label="Email" value={invoice.customer_email || "Not provided"} />
              <Detail
                label="Address"
                value={invoice.customer_address || "Not provided"}
                className="md:col-span-2"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
              Load Information
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Detail label="Load Number" value={invoice.load_number} />
              <Detail label="Invoice Number" value={invoice.invoice_number} />
              <Detail label="Pickup" value={invoice.pickup_location} />
              <Detail label="Delivery" value={invoice.delivery_location} />
              <Detail label="Pickup Date" value={invoice.pickup_date} />
              <Detail label="Delivery Date" value={invoice.delivery_date} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
              Charges
            </h2>
            <div className="mt-5 space-y-3 text-sm text-[#161616]">
              <Row label="Linehaul" value={formatMoney(invoice.linehaul_amount)} />
              <Row
                label="Additional Charges"
                value={formatMoney(invoice.additional_charges_amount)}
              />
              <Row label="Total" value={formatMoney(invoice.total_amount)} strong />
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
              Payment Terms
            </h2>
            <div className="mt-5 space-y-3 text-sm text-[#161616]">
              <Row label="Due Date" value={invoice.due_date} />
              <Row label="Terms" value={invoice.payment_terms} />
              <Row label="BOL" value={invoice.bol_filename} />
              <Row
                label="Rate Confirmation"
                value={invoice.rate_confirmation_filename}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
              Actions
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              <Button asChild className="bg-[#161616] text-white hover:bg-[#161616]/90">
                <a href={getInvoiceDownloadUrl(invoice.id)}>
                  <span className="flex items-center gap-2">
                    <Download01 className="h-4 w-4" />
                    <span>Download PDF</span>
                  </span>
                </a>
              </Button>
              <Button type="button" variant="outline" onClick={handleSendEmail} disabled={isSending}>
                <span className="flex items-center gap-2">
                  <Mail01 className="h-4 w-4" />
                  <span>{isSending ? "Sending..." : "Send Email"}</span>
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleMarkPaid}
                disabled={isPaying || invoice.status === "Paid"}
              >
                <span className="flex items-center gap-2">
                  <Wallet03 className="h-4 w-4" />
                  <span>
                    {invoice.status === "Paid"
                      ? "Already Paid"
                      : isPaying
                        ? "Updating..."
                        : "Mark as Paid"}
                  </span>
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-[#F0D4D4] text-[#A33A3A] hover:bg-[#FFF7F7]"
              >
                <span className="flex items-center gap-2">
                  <Trash03 className="h-4 w-4" />
                  <span>{isDeleting ? "Deleting..." : "Delete Invoice"}</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {emailPreview ? (
        <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#161616]">
            Fake Email Preview
          </h2>
          <div className="mt-4 space-y-2 text-sm text-[#161616]">
            <p>
              <span className="font-medium">To:</span> {emailPreview.to}
            </p>
            <p>
              <span className="font-medium">Subject:</span> {emailPreview.subject}
            </p>
            <p>
              <span className="font-medium">Body:</span> {emailPreview.body}
            </p>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </section>
  );
}

type DetailProps = {
  className?: string;
  label: string;
  value: string;
};

function Detail({ className, label, value }: DetailProps) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[#161616]">{value}</p>
    </div>
  );
}

type RowProps = {
  label: string;
  strong?: boolean;
  value: string;
};

function Row({ label, strong = false, value }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold text-[#161616]" : "text-[#161616]"}>
        {value}
      </span>
    </div>
  );
}
