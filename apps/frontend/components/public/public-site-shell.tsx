import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicNavigation } from "@/components/public/public-navigation";

type PublicSiteShellProps = {
  children: ReactNode;
};

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  return (
    <main className="min-h-screen bg-white text-[#161616]">
      <PublicNavigation />
      {children}
      <PublicFooter />
    </main>
  );
}
