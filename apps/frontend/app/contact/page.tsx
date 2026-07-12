import type { Metadata } from "next";
import Link from "next/link";

import { PublicContactForm } from "@/components/public/public-contact-form";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Contact",
  "Send Toro a product, pricing, partnership, or account-support question through the public contact path.",
  "/contact"
);

export default function ContactPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="Contact"
        title="Contact Toro"
        description="Use this form for product questions, pricing conversations, account help, or general inquiries about Toro."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-6">
              <h2 className="text-2xl font-semibold text-[#161616]">When to use this form</h2>
              <p className="mt-4 text-sm leading-7 text-[#666666]">
                Reach out for product questions, pricing, early access context,
                account issues, or partnership inquiries. Do not send invoice
                documents, passwords, or sensitive shipment information through
                the public form.
              </p>
            </div>
            <div className="rounded-[12px] border border-[#EAEAEA] bg-white p-6">
              <h2 className="text-xl font-semibold text-[#161616]">Helpful links</h2>
              <div className="mt-4 grid gap-3">
                <Link href="/support" className="text-sm font-medium text-[#161616]">
                  Support guidance
                </Link>
                <Link href="/app/login" className="text-sm font-medium text-[#161616]">
                  Log in
                </Link>
                <Link href="/app/forgot-password" className="text-sm font-medium text-[#161616]">
                  Reset password
                </Link>
              </div>
            </div>
          </div>

          <PublicContactForm />
        </div>
      </section>
    </PublicSiteShell>
  );
}
