import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageHeader } from "@/components/public/public-page-header";
import {
  FinalCtaCard,
  HeroProductPreview,
  InvoiceListPreview,
  InvoiceReviewPreview,
  TrustChecklist
} from "@/components/public/public-product-previews";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Features",
  "Review Toro’s trucking invoicing workflow, document-based billing process, and operational product focus.",
  "/features"
);

export default function FeaturesPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="Product capabilities"
        title="Trucking invoice workflow, organized from start to finish"
        description="Toro is built to help carriers prepare invoices from shipment paperwork, review the details, and keep billing work more organized without pretending to be a dispatch or accounting platform."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/register"
              className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#FFD028] px-5 text-sm font-medium text-[#161616] hover:bg-[#E9BC15]"
            >
              Create account
            </Link>
            <Link
              href="/app/login"
              className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white px-5 text-sm font-medium text-[#161616] hover:bg-[#FAFAFA]"
            >
              Log in
            </Link>
          </div>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
                Core workflow overview
              </h2>
              <p className="mt-4 text-base leading-7 text-[#666666]">
                Toro follows a clear three-step invoice path: start from
                shipment documents, process the information, and review details
                before finalizing the invoice.
              </p>
              <ol className="mt-6 space-y-3 text-sm leading-7 text-[#161616]">
                <li>1. Upload documents</li>
                <li>2. Process information</li>
                <li>3. Review invoice</li>
              </ol>
            </div>
            <HeroProductPreview />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <h2 className="text-2xl font-semibold text-[#161616]">
                Document-based invoice preparation
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#666666]">
                Toro is designed around upload, processing, review, and
                finalized invoice states. The workflow stays explicit about user
                review and does not overclaim automation.
              </p>
            </div>
            <InvoiceReviewPreview />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <InvoiceListPreview />
            <div className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <h2 className="text-2xl font-semibold text-[#161616]">
                Invoice management
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#666666]">
                Toro is meant to keep invoice records, status handling, sharing,
                and document output in one cleaner workflow instead of across
                disconnected tools.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <h2 className="text-2xl font-semibold text-[#161616]">
                Operational visibility
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#666666]">
                Toro helps teams keep invoice work visible so open billing,
                recent activity, and next actions are easier to understand.
              </p>
            </div>
            <HeroProductPreview />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-6">
              <h2 className="text-2xl font-semibold text-[#161616]">
                Business setup
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#666666]">
                Toro supports the business information needed to keep invoice
                output consistent across customer billing and remittance flows.
              </p>
            </div>
            <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-6">
              <h2 className="text-2xl font-semibold text-[#161616]">
                Account and access
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#666666]">
                Toro is browser-based, secure, and structured for individual
                access that can connect into a business billing workflow.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
                Focused product scope
              </h2>
              <p className="mt-4 text-base leading-7 text-[#666666]">
                Toro is built for invoice administration. It does not attempt to
                replace dispatch systems, accounting platforms, or fleet
                management software.
              </p>
            </div>
            <TrustChecklist
              items={[
                "Focused invoice workflow instead of generic fleet tooling.",
                "Review-based process before invoice creation.",
                "Status tracking for draft, unpaid, and paid invoices.",
                "Company-level billing and remittance consistency."
              ]}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FinalCtaCard
          title="Build a cleaner trucking invoice workflow."
          description="Create your Toro account and move into a more organized billing workflow built for carriers and small fleets."
        />
      </section>
    </PublicSiteShell>
  );
}
