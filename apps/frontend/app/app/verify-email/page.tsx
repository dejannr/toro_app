import { Suspense } from "react";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { VerifyEmailClient } from "@/components/auth/verify-email-client";

export default function VerifyEmailPage() {
  return (
    <AuthPageLayout>
      <AuthFormShell
        title="Confirming your account"
        subtitle="You will be redirected into Toro."
      >
        <Suspense fallback={null}>
          <VerifyEmailClient />
        </Suspense>
      </AuthFormShell>
    </AuthPageLayout>
  );
}
