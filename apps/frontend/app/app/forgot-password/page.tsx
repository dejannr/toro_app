import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout>
      <AuthFormShell
        title="Reset access"
        subtitle="Request a password reset link for your Toro account."
      >
        <ForgotPasswordForm />
      </AuthFormShell>
    </AuthPageLayout>
  );
}
