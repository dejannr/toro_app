import type { Metadata } from "next";

import { PublicPageHeader } from "@/components/public/public-page-header";
import {
  FinalCtaCard,
  SimpleUseCaseCard
} from "@/components/public/public-product-previews";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Use Cases",
  "See how Toro fits owner-operators, small carriers, billing teams, and small fleets handling trucking invoice work.",
  "/use-cases"
);

export default function UseCasesPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="Use cases"
        title="Built around the invoice work small trucking teams actually handle"
        description="Toro is structured for owner-operators, small carriers, billing staff, and small fleets that need a cleaner invoice workflow without taking on a broader operations platform."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <SimpleUseCaseCard
            title="Owner-operators"
            problem="You manage billing personally and need to reduce repetitive setup while keeping invoice records organized."
            description="Toro helps you start from shipment paperwork, review the details, and keep billing work more organized in one place."
          />
          <SimpleUseCaseCard
            title="Small carriers"
            problem="Your business needs a more consistent invoicing process across shared company details and back-office work."
            description="Toro keeps company billing settings, remittance details, and invoice status visibility aligned across the workflow."
          />
          <SimpleUseCaseCard
            title="Billing and administrative teams"
            problem="Invoice information lives across documents, email threads, and manual follow-up."
            description="Toro brings review, status management, PDF output, and invoice records into one operational interface."
          />
          <SimpleUseCaseCard
            title="Small fleets"
            problem="As invoice volume grows, central visibility and a repeatable billing process become harder to maintain manually."
            description="Toro provides a company-level invoice workspace with structured settings and clear invoice states."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FinalCtaCard
          title="Choose a workflow built for carrier invoice administration."
          description="Toro is designed for trucking teams that need practical invoicing structure, not a broad platform with unrelated modules."
        />
      </section>
    </PublicSiteShell>
  );
}
