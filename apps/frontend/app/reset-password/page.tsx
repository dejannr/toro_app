import { Suspense } from "react";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-10">
      <AuthFormShell title="Reset password">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </AuthFormShell>
    </main>
  );
}
