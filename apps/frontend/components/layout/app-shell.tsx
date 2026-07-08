"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const navItems = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/account", label: "Account" }
  ];

  return (
    <main className="min-h-screen bg-white text-foreground lg:flex">
      <aside className="flex w-full flex-col bg-[#161616] px-4 py-5 lg:min-h-screen lg:w-[248px] lg:px-5">
        <Link href="/app/dashboard" className="flex items-center px-2 py-3">
          <Image
            src="/logo-y.png"
            alt="Toro"
            width={120}
            height={39}
            priority
            className="h-auto w-[120px]"
          />
        </Link>

        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl border border-transparent px-4 py-3 text-sm font-medium transition-colors",
                  "text-white hover:bg-[#222222] hover:text-[#FFD028] active:border-[#313131] active:bg-[#222222] active:text-[#FFD028]",
                  isActive && "border-[#313131] bg-[#222222] text-[#FFD028]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 lg:mt-auto">
          <Link
            href="/app/logout"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#222222] hover:text-[#FFD028]"
          >
            Log out
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
      </div>
    </main>
  );
}
