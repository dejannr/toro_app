import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageIntroProps = {
  actions?: ReactNode;
  description: string;
  sticky?: boolean;
  title: string;
  titleAccessory?: ReactNode;
};

export function PageIntro({
  actions,
  description,
  sticky = false,
  title,
  titleAccessory
}: PageIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        sticky &&
          "sticky top-0 z-20 -mx-4 bg-white/95 px-4 py-2.5 sm:items-center backdrop-blur lg:-mx-6 lg:px-6",
        sticky &&
          "group-data-[scrolled=true]/app-content:border-b group-data-[scrolled=true]/app-content:border-[#F1F1F1] group-data-[scrolled=true]/app-content:shadow-[0_8px_24px_rgba(22,22,22,0.04)]"
      )}
    >
      <div className="space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold leading-tight text-[#161616]">
            {title}
          </h1>
          {titleAccessory}
        </div>
        <p className="text-sm leading-6 text-[#6F6F6F]">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
