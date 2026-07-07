"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth";
import {
  resetPasswordSchema,
  type ResetPasswordValues
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get("token") ?? "",
      password: ""
    }
  });

  async function onSubmit(values: ResetPasswordValues) {
    setError(null);
    setMessage(null);
    try {
      const response = await resetPassword(values);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password");
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="token">Reset token</Label>
        <Input
          id="token"
          autoComplete="off"
          placeholder="Enter reset token"
          {...form.register("token")}
        />
        {form.formState.errors.token ? (
          <p className="text-sm text-red-600">{form.formState.errors.token.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter new password"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        className="w-full bg-[#161616] text-white hover:bg-[#161616]/90"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        Reset password
      </Button>
      <p className="text-sm">
        <Link
          className="text-[#161616] underline-offset-4 hover:underline"
          href="/app/login"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}
