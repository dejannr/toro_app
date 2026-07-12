import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageHeader } from "@/components/public/public-page-header";
import { FinalCtaCard } from "@/components/public/public-product-previews";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Pricing",
  "See how Toro handles early-access pricing and route into the existing account creation or contact flow.",
  "/pricing"
);

export default function PricingPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="Pricing"
        title="Simple pricing for trucking teams"
        description="Toro is currently onboarding early users. Create an account or contact Toro for current access details."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-[14px] border border-[#EAEAEA] bg-[#FAFAFA] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B38A00]">
                Early access
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#161616]">
                Current access is handled directly.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#666666]">
                Pricing is not exposed as public plan tiers yet. Toro is still
                focused on onboarding users who need a clean trucking invoice
                workflow and are a fit for the current product direction.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-[#161616]">
                <li>Focused trucking invoice workflow</li>
                <li>Structured onboarding for carriers and small fleets</li>
                <li>Professional billing flow and organized invoice handling</li>
                <li>Direct product and access conversations when needed</li>
              </ul>
            </div>
            <div className="grid gap-3">
              <Link
                href="/app/register"
                className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#FFD028] px-5 text-sm font-medium text-[#161616] hover:bg-[#E9BC15]"
              >
                Create account
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white px-5 text-sm font-medium text-[#161616] hover:bg-[#FAFAFA]"
              >
                Contact Toro
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[14px] border border-[#EAEAEA] bg-white p-6">
          <h2 className="text-2xl font-semibold text-[#161616]">Pricing FAQ</h2>
          <div className="mt-6 space-y-4">
            {[
              [
                "Is pricing public yet?",
                "Not yet. Toro is currently handling access directly while the product scope continues to tighten around invoice operations."
              ],
              [
                "Can I still create an account?",
                "Yes. The account flow is available now through Toro registration."
              ],
              [
                "How do I ask about fit or access?",
                "Use the contact page if you need pricing or onboarding context before creating an account."
              ]
            ].map(([question, answer]) => (
              <div key={question} className="rounded-[10px] border border-[#EAEAEA] bg-[#FAFAFA] p-4">
                <p className="text-sm font-semibold text-[#161616]">{question}</p>
                <p className="mt-2 text-sm leading-7 text-[#666666]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FinalCtaCard
          title="Start with a Toro account and evaluate the workflow directly."
          description="If Toro fits your billing process, create an account or contact us for current access details."
        />
      </section>
    </PublicSiteShell>
  );
}
