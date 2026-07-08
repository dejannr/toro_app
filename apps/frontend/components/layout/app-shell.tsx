"use client";

import { HomeLine, LogOut01, User01 } from "@untitledui/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { CurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  user: CurrentUser;
};

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const navItems = [
    { href: "/app/dashboard", label: "Dashboard", icon: HomeLine },
    { href: "/app/account", label: "Account", icon: User01 }
  ];
  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();
  const subtitle = user.company?.legal_name ?? user.email;

  return (
    <main className="min-h-screen bg-white text-foreground lg:flex">
      <aside className="flex w-full flex-col bg-[#161616] px-3 py-5 lg:min-h-screen lg:w-[248px] lg:px-3">
        <Link href="/app/dashboard" className="flex items-center px-1 py-3">
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
            const Icon = item.icon;

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
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 lg:mt-auto">
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#222222] p-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-[#161616]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user.first_name} {user.last_name}
                </p>
                <p className="truncate text-xs text-[#8E8E8E]">{subtitle}</p>
              </div>
              <Link
                href="/app/logout"
                aria-label="Log out"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-white transition-colors hover:border-[#313131] hover:bg-[#2A2A2A] hover:text-[#FFD028] active:border-[#313131] active:bg-[#2A2A2A] active:text-[#FFD028]"
              >
                <LogOut01 className="h-5 w-5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
      </div>
    </main>
  );
}
