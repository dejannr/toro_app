"use client";

import Link from "next/link";

import { Building05 } from "@untitledui/icons";

import { PageIntro } from "@/components/layout/page-intro";
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
      <PageIntro title={title} description={description} sticky />
      <div className="rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#161616]">
          <Building05 className="h-6 w-6" />
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
