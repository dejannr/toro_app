import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <AuthFormShell title="Welcome back" subtitle="Enter your account details.">
        <LoginForm />
      </AuthFormShell>
    </AuthPageLayout>
  );
}
