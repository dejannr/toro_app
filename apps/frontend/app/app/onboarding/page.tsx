import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { CompanyOnboardingForm } from "@/components/auth/company-onboarding-form";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function OnboardingPage() {
  const cookieHeader = (await cookies()).toString();
  const user = await getCurrentUser(cookieHeader);

  if (user === null) {
    redirect("/app/login");
  }

  if (user.company) {
    redirect("/app/dashboard");
  }

  return (
    <AuthPageLayout>
      <AuthFormShell
        title="Create a company workspace"
        subtitle="This step is optional. You can create a company now or join one later."
      >
        <div className="space-y-5">
          <CompanyOnboardingForm />
          <Button asChild variant="outline" className="w-full">
            <Link href="/app/dashboard">Skip for now</Link>
          </Button>
        </div>
      </AuthFormShell>
    </AuthPageLayout>
  );
}
