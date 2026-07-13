"use client";

import { Minus, Plus } from "@untitledui/icons";
import { useState } from "react";

type FaqItem = {
  answer: string;
  question: string;
};

type PublicFaqAccordionProps = {
  items: readonly FaqItem[];
};

export function PublicFaqAccordion({ items }: PublicFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#EAEAEA] rounded-[12px] border border-[#EAEAEA] bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFD028]"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="text-sm font-medium text-[#161616] sm:text-base">
                {item.question}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-[#FAFAFA] text-[#161616]">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {isOpen ? (
              <div className="px-5 pb-5 pr-14 text-sm leading-7 text-[#666666]">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
