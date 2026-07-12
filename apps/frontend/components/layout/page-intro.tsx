import type { ReactNode } from "react";

type PageIntroProps = {
  actions?: ReactNode;
  description: string;
  title: string;
  titleAccessory?: ReactNode;
};

export function PageIntro({
  actions,
  description,
  title,
  titleAccessory
}: PageIntroProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-[#161616]">{title}</h1>
          {titleAccessory}
        </div>
        <p className="text-sm text-[#6F6F6F]">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
