import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <AppShell>
      <section className="flex min-h-[50vh] items-center justify-center">
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
