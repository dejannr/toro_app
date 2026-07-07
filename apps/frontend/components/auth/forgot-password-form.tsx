"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setError(null);
    setMessage(null);
    try {
      const response = await requestPasswordReset(values);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to request reset");
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter email"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        className="w-full bg-[#161616] text-white hover:bg-[#161616]/90"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        Request reset
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
