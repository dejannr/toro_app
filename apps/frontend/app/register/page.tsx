import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-10">
      <AuthFormShell title="Register">
        <RegisterForm />
      </AuthFormShell>
    </main>
  );
}
