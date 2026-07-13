import type { Metadata } from "next";
import Link from "next/link";

import { CheckCircle } from "@untitledui/icons";

import { PublicFaqAccordion } from "@/components/public/public-faq-accordion";
import {
  FinalCtaCard,
  MarketingVisual,
  PaperworkToInvoiceImage
} from "@/components/public/public-product-previews";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata, homepageFaqs } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Trucking invoicing software for carriers",
  "Create and manage trucking invoices from shipment paperwork. Review billing details, keep invoice records organized, and track draft, unpaid, and paid activity with Toro.",
  "/"
);

const credibilityItems = [
  "Built specifically for trucking billing",
  "Review details before finalizing",
  "Keep invoice records organized",
  "Designed for practical carrier workflows"
] as const;

const workflowSteps = [
  {
    title: "Add the load documents",
    description:
      "Add the paperwork connected to the completed shipment, such as the rate confirmation, bill of lading, or proof of delivery.",
    visual: "documents"
  },
  {
    title: "Review the invoice information",
    description:
      "Check the customer, load, charge, company, and remittance details before the invoice is finalized.",
    visual: "review"
  },
  {
    title: "Finalize and track the invoice",
    description:
      "Save a clean invoice record and keep its status visible as it moves from draft to unpaid to paid.",
    visual: "status"
  }
] as const;

const valueItems = [
  {
    title: "Prepare invoices with less repetitive entry",
    description:
      "Start from the documents already connected to the load instead of rebuilding the invoice from a blank page."
  },
  {
    title: "Catch details before finalizing",
    description:
      "Review the information that matters before the invoice becomes part of your billing records."
  },
  {
    title: "Keep every invoice easy to find",
    description:
      "See drafts, unpaid invoices, paid invoices, customers, amounts, and recent activity from one organized workspace."
  },
  {
    title: "Keep company and remittance details consistent",
    description:
      "Use the same business and payment information across invoices without retyping it every time."
  }
] as const;

const comparisonRows = [
  ["Works from shipment paperwork", "Usually begins with manual invoice entry", "Begins with the completed load and its paperwork"],
  ["Uses trucking-specific document language", "Uses general business terminology", "Uses rate confirmation, BOL, and POD language"],
  ["Keeps load documents connected to billing", "Document workflow is not the primary focus", "Paperwork stays connected to the invoice workflow"],
  ["Supports review before finalizing", "Varies by product and process", "Built around a clear review step"],
  ["Tracks draft, unpaid, and paid activity", "Often presented as general invoice status", "Visible through a trucking invoice workspace"],
  ["Maintains company and remittance details", "General business settings", "Consistent carrier billing and remittance information"]
] as const;

const audiences = [
  {
    title: "Owner-operators",
    description:
      "Create professional invoice records without turning every completed load into another evening of office work."
  },
  {
    title: "Small carriers",
    description:
      "Give your team a repeatable billing process as invoice volume grows, without adopting an oversized enterprise system."
  },
  {
    title: "Billing and back-office teams",
    description:
      "Review invoice details, find records quickly, and keep unpaid and paid activity visible from one place."
  }
] as const;

function SectionHeading({
  description,
  title
}: {
  description?: string;
  title: string;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-semibold leading-tight text-[#161616] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-[#666666]">{description}</p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicSiteShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A98000]">
            Trucking invoicing software
          </p>
          <h1 className="mt-4 max-w-[640px] text-5xl font-semibold leading-[1.06] text-[#161616] sm:text-[58px]">
            Turn load paperwork into invoices you can review.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#666666]">
            Add the documents from a completed load, review the billing information,
            and keep every draft, unpaid, and paid invoice organized in one place.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Link
              href="/app/register"
              className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#FFD028] px-5 text-sm font-medium text-[#161616] transition-colors hover:bg-[#E9BC15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] focus-visible:ring-offset-2"
            >
              Create account
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white px-5 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD028] focus-visible:ring-offset-2"
            >
              See how Toro works
            </Link>
          </div>
          <p className="mt-5 text-sm text-[#6B6B6B]">
            Built for owner-operators, small carriers, and trucking back offices.
          </p>
        </div>
        <PaperworkToInvoiceImage className="aspect-[4/3]" />
      </section>

      <section className="border-y border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {credibilityItems.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-medium text-[#3F3F3F]">
              <CheckCircle className="h-5 w-5 shrink-0 text-[#A98000]" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-20">
        <SectionHeading
          title="The load is complete. The office work is not."
          description="After delivery, information can still be spread across a rate confirmation, BOL, POD, email, and notes. Rebuilding those details for billing takes time and makes it harder to see what still needs attention."
        />
        <MarketingVisual variant="comparison" className="min-h-[300px]" />
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-y border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHeading
            title="From shipment paperwork to a ready-to-manage invoice"
            description="Toro follows the billing path carriers already know, with a clear review step before invoice information is finalized."
          />
          <div className="relative mt-10 grid gap-8 lg:grid-cols-3 lg:gap-8">
            {workflowSteps.map((step, index) => (
              <article
                key={step.title}
                className="relative grid h-full grid-rows-[3.5rem_auto_minmax(5.5rem,1fr)_auto]"
              >
                {index < workflowSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-7 top-7 z-0 hidden h-px w-[calc(100%+2rem)] bg-[#E1C15B] lg:block"
                  />
                ) : null}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#E9C13B] bg-[#FFD028] text-sm font-semibold text-[#161616]">
                  {index + 1}
                </div>
                <h3 className="mt-5 self-end text-xl font-semibold text-[#161616]">{step.title}</h3>
                <p className="pt-3 text-sm leading-7 text-[#666666]">{step.description}</p>
                <MarketingVisual variant={step.visual} className="mt-5 h-[294px]" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <SectionHeading
            title="Less invoice rebuilding. More control over billing."
            description="Toro is focused on the work between a completed load and an organized invoice record."
          />
          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {valueItems.map((item) => (
              <div key={item.title} className="border-t border-[#EAEAEA] pt-4">
                <h3 className="text-base font-semibold text-[#161616]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#666666]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <MarketingVisual variant="details" className="min-h-[380px]" />
      </section>

      <section className="border-y border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <SectionHeading
            title="Generic invoicing starts with a blank form. Toro starts with the load."
            description="General invoicing software can support billing, but Toro is designed around the shipment paperwork and review work that come before a trucking invoice."
          />
          <div className="mt-9 overflow-x-auto rounded-[12px] border border-[#EAEAEA] bg-white">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-[#FAFAFA] text-[#161616]">
                <tr>
                  <th scope="col" className="w-[30%] px-5 py-4 font-semibold">Workflow requirement</th>
                  <th scope="col" className="w-[35%] px-5 py-4 font-semibold">Generic invoicing software</th>
                  <th scope="col" className="w-[35%] px-5 py-4 font-semibold">Toro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA] text-[#5F5F5F]">
                {comparisonRows.map(([requirement, generic, toro]) => (
                  <tr key={requirement}>
                    <th scope="row" className="px-5 py-4 font-medium text-[#161616]">{requirement}</th>
                    <td className="px-5 py-4 leading-6">{generic}</td>
                    <td className="px-5 py-4 leading-6 text-[#161616]">{toro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="who-its-for" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading title="Built for the people who keep carrier billing moving" />
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="rounded-[12px] border border-[#EAEAEA] bg-white p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#FFF2C7] text-sm font-semibold text-[#161616]">
                {audience.title.charAt(0)}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-[#161616]">{audience.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#666666]">{audience.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-20">
          <SectionHeading
            title="One place to review what needs attention"
            description="Toro keeps the next billing action visible, so users can spend less time searching through folders, spreadsheets, and email threads."
          />
          <MarketingVisual variant="attention" className="min-h-[340px]" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <SectionHeading
            title="Automation where it helps. Review where it matters."
            description="Toro is designed to reduce repetitive work without taking control away from the person responsible for billing. Important invoice details remain visible and reviewable before the record is finalized."
          />
          <ul className="mt-8 space-y-4">
            {[
              "Review invoice information before finalizing.",
              "Keep company and remittance information consistent.",
              "Keep shipment documents connected to the billing workflow.",
              "Use protected account access through Toro authentication."
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#3F3F3F]">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#A98000]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <MarketingVisual variant="confirmation" className="min-h-[340px]" />
      </section>

      <section className="border-y border-[#EFEFEF] bg-[#FAFAFA]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A98000]">Why Toro</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#161616] sm:text-4xl">
              Built around the work carriers already do
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#666666]">
            Toro does not ask a trucking business to reshape its billing process around generic accounting terminology. It follows the familiar path from shipment documents to reviewed invoice information and organized invoice records.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            title="Questions before creating an account"
            description="Straight answers about the workflow, company setup, and whether Toro fits your billing work."
          />
          <PublicFaqAccordion items={homepageFaqs} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-20">
        <FinalCtaCard
          title="The load is done. Your invoice should not take all night."
          description="Bring shipment paperwork, invoice review, and billing status into one focused trucking workflow."
        />
      </section>
    </PublicSiteShell>
  );
}
