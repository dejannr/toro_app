"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked: boolean;
};

export function Switch({ checked, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD231]/35",
        checked
          ? "border-[#FFD028] bg-[#FFD028]"
          : "border-[#E3E3E3] bg-[#F3F3F3]",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[21px]" : "translate-x-1"
        )}
      />
    </button>
  );
}
