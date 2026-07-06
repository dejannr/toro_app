import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthPageLayout>
      <AuthFormShell title="Create account" subtitle="Enter your account details.">
        <RegisterForm />
      </AuthFormShell>
    </AuthPageLayout>
  );
}
