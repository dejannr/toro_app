import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { Button } from "@/components/ui/button";

type CheckEmailPageProps = {
  searchParams: {
    email?: string;
    verify?: string;
  };
};

export default async function CheckEmailPage({
  searchParams
}: CheckEmailPageProps) {
  const params = searchParams;

  if (!params.email || !params.verify) {
    redirect("/app/register");
  }

  return (
    <AuthPageLayout>
      <AuthFormShell
        title="Check your email"
        subtitle="Email delivery is faked for now so you can continue immediately."
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#EFEFEF] bg-white p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Fake inbox
            </p>
            <p className="mt-3 text-sm text-foreground">{params.email}</p>
            <p className="mt-2 text-sm font-medium text-foreground">
              Confirm your Toro account
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Open the verification link below to enter Toro and decide whether to
              create or join a company later.
            </p>
          </div>
          <Button
            asChild
            className="w-full bg-[#161616] text-white hover:bg-[#161616]/90"
          >
            <Link href={params.verify}>Open confirmation link</Link>
          </Button>
        </div>
      </AuthFormShell>
    </AuthPageLayout>
  );
}
