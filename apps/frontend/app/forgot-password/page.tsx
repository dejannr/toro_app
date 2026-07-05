import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-10">
      <AuthFormShell title="Forgot password">
        <ForgotPasswordForm />
      </AuthFormShell>
    </main>
  );
}
