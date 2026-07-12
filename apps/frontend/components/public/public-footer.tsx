import Image from "next/image";
import Link from "next/link";

import { footerGroups } from "@/lib/public-site";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#161616] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm space-y-4">
            <Image
              src="/logo-white.png"
              alt="Toro"
              width={120}
              height={39}
              className="h-auto w-[112px]"
            />
            <p className="text-sm leading-6 text-[#B9B9B9]">
              Trucking invoicing software built for carriers and small fleets.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#B9B9B9] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#2A2A2A] pt-6 text-sm text-[#9A9A9A]">
          © {year} Toro
        </div>
      </div>
    </footer>
  );
}
