import type { Metadata } from "next";

import { PublicFaqAccordion } from "@/components/public/public-faq-accordion";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata, faqSections } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "FAQ",
  "Read common answers about Toro’s product scope, invoice workflow, account setup, and support paths.",
  "/faq"
);

export default function FaqPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="FAQ"
        title="Questions about the Toro workflow and account setup"
        description="Direct answers about product scope, invoice handling, company setup, and access."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-10">
          {faqSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-[#161616]">{section.title}</h2>
              <div className="mt-5">
                <PublicFaqAccordion items={section.items} />
              </div>
            </section>
          ))}
        </div>
      </section>
    </PublicSiteShell>
  );
}
