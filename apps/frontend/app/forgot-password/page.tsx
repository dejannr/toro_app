import { redirect } from "next/navigation";

export default function LegacyForgotPasswordPage() {
  redirect("/app/forgot-password");
}
