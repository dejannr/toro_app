import type { Metadata } from "next";
import Link from "next/link";

import { PublicFaqAccordion } from "@/components/public/public-faq-accordion";
import {
  FinalCtaCard,
  HeroProductPreview,
  TrustChecklist,
  WorkflowStepPreview
} from "@/components/public/public-product-previews";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { homepageFaqs, buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Trucking Invoicing Software",
  "Create professional trucking invoices from shipment paperwork and keep billing work organized with Toro.",
  "/"
);

export default function HomePage() {
  return (
    <PublicSiteShell>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:py-20">
        <div>
          <span className="inline-flex rounded-full border border-[#EFE7D4] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#B38A00]">
            Trucking invoicing software
          </span>
          <h1 className="mt-5 max-w-xl text-5xl font-semibold tracking-tight text-[#161616] sm:text-6xl">
            Create trucking invoices from shipment paperwork without rebuilding
            every detail by hand.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#666666]">
            Toro helps carriers and small fleets prepare invoices, review the
            details, track status, and keep billing information organized in one
            operational workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app/register"
              className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#FFD028] px-5 text-sm font-medium text-[#161616] transition-colors hover:bg-[#E9BC15]"
            >
              Create account
            </Link>
            <Link
              href="/features"
              className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white px-5 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
            >
              See how Toro works
            </Link>
          </div>
        </div>
        <div className="mt-10 lg:mt-0">
          <HeroProductPreview />
        </div>
      </section>

      <section id="workflow" className="border-t border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
              From shipment paperwork to a finished invoice
            </h2>
            <p className="mt-4 text-base leading-7 text-[#666666]">
              Toro keeps invoice work close to the day-to-day trucking process.
              Start from the documents you already have, review the details, and
              keep the invoice moving.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <WorkflowStepPreview
              step="1"
              title="Add shipment documents"
              description="Start from bills of lading, rate confirmations, and the paperwork already used in your operation."
            />
            <WorkflowStepPreview
              step="2"
              title="Review invoice information"
              description="Use Toro’s review flow to confirm customer, load, billing, and remittance information before creating the invoice."
            />
            <WorkflowStepPreview
              step="3"
              title="Finalize and manage the invoice"
              description="Create the invoice, download the PDF, use the supported send flow, and keep the status visible afterward."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
              Built for practical billing work
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#666666]">
              Toro is designed to help carriers turn shipment paperwork into
              professional invoices with less manual rebuilding, clearer status
              handling, and more consistent billing information.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [
                  "Faster invoice preparation",
                  "Reduce repetitive setup by starting from the documents your operation already uses."
                ],
                [
                  "Cleaner workflow",
                  "Keep billing work structured instead of spreading it across files, messages, and manual follow-up."
                ],
                [
                  "Better visibility",
                  "Know what still needs attention and keep invoice progress easier to track."
                ],
                [
                  "Consistent billing details",
                  "Use the same business and remittance information across invoice work."
                ]
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-[12px] border border-[#EAEAEA] bg-white p-5"
                >
                  <h3 className="text-lg font-semibold text-[#161616]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#666666]">{description}</p>
                </div>
              ))}
            </div>
          </div>
          <HeroProductPreview />
        </div>
      </section>

      <section className="border-y border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
            Built for the people running trucking operations
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              [
                "Owner-operators",
                "Prepare invoices faster, keep records organized, and avoid rebuilding the same billing details by hand."
              ],
              [
                "Small carriers",
                "Standardize invoicing across your billing process and reduce repeated back-office effort."
              ],
              [
                "Billing and back-office teams",
                "Review invoice information, manage status, download PDFs, and reduce fragmented paperwork handling."
              ]
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-[12px] border border-[#EAEAEA] bg-white p-5"
              >
                <h3 className="text-lg font-semibold text-[#161616]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#666666]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
              Product principles that match real carrier work
            </h2>
            <p className="mt-4 text-base leading-7 text-[#666666]">
              Toro is focused on secure access, review before finalizing,
              consistent records, and workflows small teams can actually
              maintain.
            </p>
          </div>
          <TrustChecklist
            items={[
              "Secure account access through Toro authentication.",
              "Review invoice details before finalizing the record.",
              "Consistent invoice, company, and remittance information.",
              "A workflow built around carrier invoice administration."
            ]}
          />
        </div>
      </section>

      <section className="border-y border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
                Common questions before signup
              </h2>
              <p className="mt-3 text-base leading-7 text-[#666666]">
                Straight answers about workflow, account setup, and product fit.
              </p>
            </div>
            <Link href="/faq" className="text-sm font-medium text-[#161616]">
              View all FAQs
            </Link>
          </div>
          <div className="mt-8">
            <PublicFaqAccordion items={homepageFaqs} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <FinalCtaCard
          title="Spend less time rebuilding invoices from paperwork."
          description="Create your account, get set up, and move into a cleaner trucking invoice workflow with Toro."
        />
      </section>
    </PublicSiteShell>
  );
}
