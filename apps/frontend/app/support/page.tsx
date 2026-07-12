import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageHeader } from "@/components/public/public-page-header";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { buildPublicMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildPublicMetadata(
  "Support",
  "Find Toro login help, password reset links, email verification guidance, company setup help, and the public support contact path.",
  "/support"
);

export default function SupportPage() {
  return (
    <PublicSiteShell>
      <PublicPageHeader
        eyebrow="Support"
        title="Public support entry point"
        description="Use these links for login help, password reset, email verification guidance, account access issues, and company setup questions."
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            [
              "Login help",
              "If you already have an account, use the Toro login route and make sure you are signing in with the same verified email address."
            ],
            [
              "Password reset",
              "If you cannot access your account, use the existing Toro forgot-password flow to request a reset."
            ],
            [
              "Email verification",
              "New accounts still follow an email verification step before entering the main workflow."
            ],
            [
              "Company setup guidance",
              "Business setup follows the initial signup flow so personal access and company information stay separate."
            ]
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-5"
            >
              <h2 className="text-lg font-semibold text-[#161616]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#666666]">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/app/login"
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#161616] px-5 text-sm font-medium text-white hover:bg-[#222222]"
          >
            Log in
          </Link>
          <Link
            href="/app/forgot-password"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white px-5 text-sm font-medium text-[#161616] hover:bg-[#FAFAFA]"
          >
            Forgot password
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white px-5 text-sm font-medium text-[#161616] hover:bg-[#FAFAFA]"
          >
            Contact Toro
          </Link>
        </div>
      </section>
    </PublicSiteShell>
  );
}
