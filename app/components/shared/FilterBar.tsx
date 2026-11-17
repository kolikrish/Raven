
"use client";

import { FadeUp } from "../Animations/gsapAnim";
import { PAGE_DELAY } from "../Animations/timing";

type Option = { value: string; label: string; count?: number };

type FilterBarProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  countText: string;
};

const FilterBar = ({ label, options, value, onChange, countText }: FilterBarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-5 max-md:flex-col max-md:items-start max-md:gap-6">
    <div role="group" aria-label={label} className="flex flex-wrap gap-2 max-lg:gap-3">
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <FadeUp key={option.value} delay={PAGE_DELAY + 0.4 + index * 0.1}>
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`font-raven-head flex h-[5vh] items-center gap-3 rounded-full border px-[1.2vw] text-22 transition-colors duration-300 max-lg:h-[3.6vh] max-lg:px-[2.4vw] max-md:h-[5.8vh] max-md:px-[4vw] ${
                active
                  ? "border-(--raven-ink) bg-(--raven-ink) text-(color:--raven-paper)"
                  : "border-(--raven-ink)/30 text-(color:--raven-ink) hover:border-(--raven-ink)"
              }`}
            >
              {option.label}
              {option.count !== undefined && <span className="text-14 opacity-60">{option.count}</span>}
            </button>
          </FadeUp>
        );
      })}
    </div>
    <FadeUp delay={PAGE_DELAY + 0.4 + options.length * 0.1}>
      <p aria-live="polite" className="text-24 text-raven-muted">
        {countText}
      </p>
    </FadeUp>
  </div>
);

export default FilterBar;
