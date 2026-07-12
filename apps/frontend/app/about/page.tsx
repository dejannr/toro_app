import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageHeader } from "@/components/public/public-page-header";
import {
  FinalCtaCard,
  TrustChecklist
} from "@/components/public/public-product-previews";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "About",
  "Understand why Toro exists, what problem it is focused on, and the product principles behind the trucking invoice workflow.",
  "/about"
);

export default function AboutPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="About Toro"
        title="Toro exists to reduce invoice administration for trucking businesses"
        description="The product is intentionally focused on invoice workflow for carriers and small fleets instead of trying to become a broad operations suite."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
              Mission
            </h2>
            <p className="mt-4 text-base leading-7 text-[#666666]">
              Toro is built to reduce repetitive invoice administration and give
              trucking teams a clearer place to manage invoice work.
            </p>
          </div>
          <div className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <h3 className="text-xl font-semibold text-[#161616]">Problem</h3>
            <p className="mt-4 text-sm leading-7 text-[#666666]">
              Shipment documents arrive in different forms, invoice creation is
              repetitive, and small teams often manage billing through fragmented
              manual processes. Toro is meant to tighten that workflow without
              inflating the system around it.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#161616]">
              Product principles
            </h2>
          </div>
          <TrustChecklist
            items={[
              "Operational clarity over broad feature sprawl.",
              "Focused workflows that stay understandable for small teams.",
              "Review before finalizing invoice records.",
              "Professional output and consistent billing details.",
              "Build only what is useful inside the invoice workflow."
            ]}
          />
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {[
            [
              "Who Toro is built for",
              "Owner-operators, small carriers, billing staff, and small fleets handling invoice work."
            ],
            [
              "Current focus",
              "Invoice preparation, review, organized billing work, and a focused trucking invoicing workflow."
            ],
            [
              "Contact path",
              "Use the public contact page for pricing, product, or account questions when you need direct help."
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

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white px-5 text-sm font-medium text-[#161616] hover:bg-[#FAFAFA]"
          >
            Contact Toro
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FinalCtaCard
          title="Use a product that stays honest about its scope."
          description="Toro is focused on invoice administration for carriers and small fleets, without pretending to be a broad operations suite."
        />
      </section>
    </PublicSiteShell>
  );
}
