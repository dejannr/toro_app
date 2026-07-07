import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthPageLayout>
      <AuthFormShell title="Create your Toro account" subtitle="Set up your user account first.">
        <RegisterForm />
      </AuthFormShell>
    </AuthPageLayout>
  );
}
