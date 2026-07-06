import Image from "next/image";
import type { ReactNode } from "react";

type AuthPageLayoutProps = {
  children: ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        {children}
      </section>
      <section className="relative hidden min-h-screen overflow-hidden rounded-l-[28px] bg-muted lg:block">
        <Image
          src="/img.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </section>
    </main>
  );
}
