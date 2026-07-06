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
      <section className="hidden min-h-screen p-3 lg:block">
        <div className="relative h-full overflow-hidden rounded-[28px] border-[5px] border-[#FBFBFB] bg-muted">
          <Image
            src="/img.png"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
}
