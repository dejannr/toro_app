import type { Metadata } from "next";

import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Terms of Service",
  "Read Toro’s terms page structure and current development placeholder for approved legal terms.",
  "/terms"
);

export default function TermsPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="This page structure is ready for approved legal terms. Development placeholders remain until final legal text is available."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-[#6B6B6B]">Last updated: July 12, 2026</p>
        <div className="mt-8 space-y-8 rounded-[12px] border border-[#EAEAEA] bg-white p-6">
          {[
            "Use of the service",
            "Accounts",
            "Acceptable conduct",
            "Service availability",
            "Contact information"
          ].map((title) => (
            <section key={title}>
              <h2 className="text-xl font-semibold text-[#161616]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#666666]">
                Development placeholder: approved legal terms have not yet been
                supplied for this section.
              </p>
            </section>
          ))}
        </div>
      </section>
    </PublicSiteShell>
  );
}
