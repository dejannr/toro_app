"use client";

import { useState } from "react";

import { CompanyOnboardingForm } from "@/components/auth/company-onboarding-form";
import { Button } from "@/components/ui/button";

export function CompanySetupPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="max-w-3xl space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome to Toro
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Your user account is active. You can create a company workspace now,
            or wait and join an existing company later.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <p className="text-sm font-medium text-foreground">
              Create a company
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start a new Toro workspace and become the owner account.
            </p>
            <Button
              className="mt-5 bg-[#161616] text-white hover:bg-[#161616]/90"
              onClick={() => setIsOpen(true)}
            >
              Create workspace
            </Button>
          </div>
          <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-6">
            <p className="text-sm font-medium text-foreground">Join later</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep your personal account ready and join an existing company when
              invite or membership flow is added.
            </p>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#161616]/45 px-4 py-6">
          <div className="w-full max-w-xl rounded-[28px] border border-[#EFE7D4] bg-[#FFFCF5] p-6 shadow-[0_32px_90px_rgba(22,22,22,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-[#161616]">
                  Create a company workspace
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  This step is optional. You can create a company now or join an
                  existing company later.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
            <div className="mt-6">
              <CompanyOnboardingForm
                submitLabel="Create workspace"
                onSuccess={() => setIsOpen(false)}
                cancelAction={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Maybe later
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
