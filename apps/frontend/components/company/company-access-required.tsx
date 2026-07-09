"use client";

import Link from "next/link";

import { Building05 } from "@untitledui/icons";

import { Button } from "@/components/ui/button";

type CompanyAccessRequiredProps = {
  description: string;
  title: string;
};

export function CompanyAccessRequired({
  description,
  title
}: CompanyAccessRequiredProps) {
  return (
    <section className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#161616]">
          <Building05 className="h-6 w-6" />
        </div>
        <div className="mt-6 space-y-3">
          <h1 className="text-2xl font-semibold text-[#161616]">{title}</h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-[#161616] text-white hover:bg-[#161616]/90"
          >
            <Link href="/app/company">Go to Company</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
