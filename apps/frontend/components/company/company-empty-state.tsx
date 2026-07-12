"use client";

import { Building05 } from "@untitledui/icons";

import { CompanyOnboardingForm } from "@/components/auth/company-onboarding-form";
import { PageIntro } from "@/components/layout/page-intro";

export function CompanyEmptyState() {
  return (
    <section className="space-y-6">
      <PageIntro
        title="Company settings"
        description="No company is linked to this account yet. Create a workspace when you are ready."
        sticky
      />

      <div className="rounded-[16px] border border-[#E7E7E7] bg-[#FAFAFA] p-5 lg:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#161616]">
            <Building05 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-[#161616]">
              Create company workspace
            </h2>
            <p className="text-sm text-[#6F6F6F]">
              This connects your account to a company profile and invoice settings.
            </p>
          </div>
        </div>
        <div className="mt-6 max-w-xl">
          <CompanyOnboardingForm submitLabel="Create workspace" />
        </div>
      </div>
    </section>
  );
}
