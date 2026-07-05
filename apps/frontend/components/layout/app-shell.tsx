import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold">
            App
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/account">Account</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </main>
  );
}
