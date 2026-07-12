import type { ReactNode } from "react";

type PublicPageHeaderProps = {
  actions?: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
};

export function PublicPageHeader({
  actions,
  description,
  eyebrow,
  title
}: PublicPageHeaderProps) {
  return (
    <section className="border-b border-[#EFEFEF] bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:flex lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B38A00]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#161616] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6B6B6B] sm:text-lg">
            {description}
          </p>
        </div>
        {actions ? <div className="mt-6 lg:mt-0 lg:pl-8">{actions}</div> : null}
      </div>
    </section>
  );
}
