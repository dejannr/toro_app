import { Suspense } from "react";

import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      <AuthFormShell title="Create a new password" subtitle="Finish resetting your Toro account password.">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </AuthFormShell>
    </AuthPageLayout>
  );
}
