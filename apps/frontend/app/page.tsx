import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const features = [
  "Separate user account and company onboarding",
  "Verification-first signup path",
  "Workspace foundation for dispatch, docs, and invoicing later"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFFCF5] text-[#161616]">
      <header className="border-b border-[#EFE7D4] bg-white/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-sm font-semibold">Toro</span>
          <div className="flex items-center gap-3">
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-[#161616]"
              href="/app/login"
            >
              Log in
            </Link>
            <Button
              asChild
              className="bg-[#161616] text-white hover:bg-[#161616]/90"
            >
              <Link href="/app/register">Start free</Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl gap-12 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-[#EFE7D4] bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#B38A00]">
            Trucking SaaS foundation
          </div>
          <div className="space-y-5">
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-tight">
              Run your trucking back office in Toro.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[#5F5A4F]">
              Create your user account, verify your email, register your company,
              and enter the app. The workflow is ready for onboarding now and
              for trucking operations later.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#161616] text-white hover:bg-[#161616]/90"
            >
              <Link href="/app/register">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/app/login">Sign in</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-[#EFE7D4] bg-white px-4 py-4 text-sm text-[#5F5A4F]"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[540px] overflow-hidden rounded-[28px] border-2 border-[#EFEFEF] bg-white p-2">
          <div className="absolute left-6 top-6 z-10 rounded-full border border-[#EFE7D4] bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#B38A00]">
            Account -&gt; verify -&gt; company -&gt; app
          </div>
          <div className="absolute bottom-8 left-8 z-10 max-w-xs rounded-[24px] bg-white/90 p-6 shadow-[0_20px_70px_rgba(22,22,22,0.08)] backdrop-blur">
            <p className="text-sm font-medium">Toro onboarding</p>
            <p className="mt-2 text-sm leading-6 text-[#5F5A4F]">
              The first step is a personal user account. Company data comes
              after email confirmation so the workspace stays separate from the
              person.
            </p>
          </div>
          <Image
            src="/img.jpeg"
            alt="Toro logistics map"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rounded-[22px] object-cover"
          />
        </div>
      </section>
    </main>
  );
}
