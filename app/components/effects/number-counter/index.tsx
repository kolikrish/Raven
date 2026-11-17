"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../Animations/reducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Adapted from the Number Counter effect's second digit-scroller variant.
const DIGITS = [...Array(10).keys(), 0];

type ScrollCounterProps = {
  value: string;
  className?: string;
  duration?: number;
  stagger?: number;
  delay?: number;
};

export function ScrollCounter({ value, className = "", duration = 1.5, stagger = 0.1, delay = 0 }: ScrollCounterProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const columns = gsap.utils.toArray<HTMLElement>("[data-scroll-counter-digit]", root);
    const target = (column: HTMLElement) => {
      const digit = Number(column.dataset.scrollCounterDigit);
      return `${-(digit === 0 ? 10 : digit) * 1.1}em`;
    };

    if (prefersReducedMotion()) {
      columns.forEach((column) => gsap.set(column, { y: target(column) }));
      return;
    }

    columns.forEach((column, index) => {
      gsap.fromTo(column, { y: "0em" }, {
        y: target(column),
        duration,
        delay: delay + index * stagger,
        ease: "power2.inOut",
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });
    });
  }, { scope: rootRef, dependencies: [value, duration, stagger, delay], revertOnUpdate: true });

  return (
    <span ref={rootRef} className={`inline-flex items-end leading-[1.1] tabular-nums ${className}`.trim()}>
      <span className="sr-only">{value}</span>
      {value.split("").map((char, index) => /\d/.test(char) ? (
        <span key={index} aria-hidden className="relative inline-flex h-[1.1em] justify-center overflow-hidden leading-[1.1]">
          <span className="invisible">{char}</span>
          <span data-scroll-counter-digit={char} className="absolute inset-x-0 top-0 flex flex-col items-center">
            {DIGITS.map((number, digitIndex) => (
              <span key={digitIndex} className="flex h-[1.1em] shrink-0 items-center justify-center leading-[1.1]">
                {number}
              </span>
            ))}
          </span>
        </span>
      ) : <span key={index} aria-hidden className="whitespace-pre">{char}</span>)}
    </span>
  );
}
