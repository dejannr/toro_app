"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { verifyEmail } from "@/lib/auth";

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Confirming your email...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Missing verification token");
      setMessage("");
      return;
    }

    let active = true;

    const verificationToken = token;

    async function runVerification() {
      try {
        const response = await verifyEmail(verificationToken);
        if (!active) {
          return;
        }
        setMessage(response.message);
        router.replace(response.onboarding_path);
        router.refresh();
      } catch (err) {
        if (!active) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Unable to verify your email"
        );
        setMessage("");
      }
    }

    void runVerification();

    return () => {
      active = false;
    };
  }, [router, token]);

  return (
    <div className="space-y-3 text-center">
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
