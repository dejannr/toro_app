import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#FFFCF5] text-foreground">
      <header className="border-b border-[#EFE7D4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/app/dashboard" className="text-sm font-semibold text-[#161616]">
            Toro
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/app/account">Account</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[#161616] text-white hover:bg-[#161616]/90"
            >
              <Link href="/app/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/app/logout">Log out</Link>
            </Button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
    </main>
  );
}
