"use client";

import { Menu01, XClose } from "@untitledui/icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { publicPrimaryNav } from "@/lib/public-site";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export function PublicNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 8);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[#EFEFEF] bg-white/95 backdrop-blur transition-shadow",
        hasScrolled && "shadow-[0_4px_16px_rgba(22,22,22,0.04)]"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="Toro homepage">
          <Image
            src="/logo-black.png"
            alt="Toro"
            width={120}
            height={39}
            priority
            className="h-auto w-[112px] sm:w-[120px]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {publicPrimaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#5F5F5F] transition-colors hover:text-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD028] focus-visible:ring-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/app/login"
            className="text-sm font-medium text-[#5F5F5F] transition-colors hover:text-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD028] focus-visible:ring-offset-4"
          >
            Log in
          </Link>
          <Button
            asChild
            className="h-10 rounded-[10px] bg-[#FFD028] px-4 text-[#161616] hover:bg-[#E9BC15]"
          >
            <Link href="/app/register">Create account</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#EAEAEA] text-[#161616] lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <XClose className="h-5 w-5" /> : <Menu01 className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[#EFEFEF] transition-[max-height] duration-200 lg:hidden",
          isOpen ? "max-h-[420px]" : "max-h-0 border-t-0"
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6">
          {publicPrimaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[10px] px-3 py-3 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-[10px] px-3 py-3 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <div className="mt-2 grid gap-3">
            <Button asChild variant="outline" className="rounded-[10px]">
              <Link href="/app/login" onClick={() => setIsOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-[10px] bg-[#FFD028] text-[#161616] hover:bg-[#E9BC15]"
            >
              <Link href="/app/register" onClick={() => setIsOpen(false)}>
                Create account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
