
"use client";

import { useRef } from "react";
import { useMagnetic } from "../Animations/useMagnetic";

type SoundToggleProps = {
  inverted?: boolean;
};

const SoundToggle = ({ inverted = false }: SoundToggleProps) => {
  const on = false;
  const ref = useRef<HTMLButtonElement | null>(null);
  useMagnetic(ref, 0.4);

  return (
    <button
      ref={ref}
      type="button"
      data-sound-toggle
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className={`flex aspect-square h-[5.5vh] shrink-0 items-center justify-center rounded-full border transition-colors duration-300 max-lg:h-[5.7vh] max-md:h-[6.4vh] ${
        inverted
          ? "border-(--raven-white)/30 text-(color:--raven-paper) hover:bg-(--raven-paper) hover:text-(color:--raven-ink)"
          : "border-(--raven-ink)/30 text-(color:--raven-ink) hover:border-(--raven-ink) hover:bg-(--raven-ink) hover:text-(color:--raven-paper)"
      }`}
    >
      <span aria-hidden className="flex h-[1.1vh] items-end gap-0.5 max-lg:h-[1.5vh] max-md:h-[1.7vh]">
        {[0, 1, 2, 3].map((index) => (
          <i key={index} className="block h-[28%] w-[0.1vw] rounded-full bg-current max-lg:w-[0.3vw] max-md:w-[0.5vw]" />
        ))}
      </span>
    </button>
  );
};

export default SoundToggle;
