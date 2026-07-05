import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-10">
      <AuthFormShell title="Log in">
        <LoginForm />
      </AuthFormShell>
    </main>
  );
}
