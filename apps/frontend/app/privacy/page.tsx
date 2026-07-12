import type { Metadata } from "next";

import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Privacy Policy",
  "Read Toro’s privacy page structure and current development placeholder for approved legal policy content.",
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="This page structure is ready for approved legal copy. Development placeholders are clearly marked until final policy text is provided."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-[#6B6B6B]">Last updated: July 12, 2026</p>
        <div className="mt-8 space-y-8 rounded-[12px] border border-[#EAEAEA] bg-white p-6">
          {[
            "Information we collect",
            "How information is used",
            "Data retention",
            "Security",
            "Contact information"
          ].map((title) => (
            <section key={title}>
              <h2 className="text-xl font-semibold text-[#161616]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#666666]">
                Development placeholder: approved legal privacy copy has not yet
                been supplied for this section.
              </p>
            </section>
          ))}
        </div>
      </section>
    </PublicSiteShell>
  );
}
