// Adapted from the Vault "variable text proximity" effect: letters near the cursor gain
// weight on the font's variable axis. This version also fits the word to its container's
// width, and on touch screens a slow sweep stands in for the cursor. With `wave`, a weight
// wave also runs left to right on its own, and the cursor still swells the letters it nears.

"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "../../Animations/reducedMotion";

type VariableTextProximityProps = {
  label: string;
  /** Weight of letters far from the cursor */
  fromWeight?: number;
  /** Weight of the letter right under the cursor */
  toWeight?: number;
  /** Reach of the effect, as a share of the font size */
  radius?: number;
  /** Share of the container width the word fills; glyphs like ® draw past their box */
  fill?: number;
  /** Largest font size, as a share of the viewport height (desktop only) */
  maxHeight?: number;
  /** A weight wave that sweeps left to right on its own, on top of the cursor effect */
  wave?: boolean;
  /** Milliseconds for one sweep of the wave across the word */
  wavePeriod?: number;
  className?: string;
  /** Classes for the word itself, e.g. a CSS font size matching what the fit arrives at */
  wordClassName?: string;
  /** Keep the word hidden until its first fit, so the letters don't visibly jump to their
   *  fitted widths. For words that aren't on screen at load, like the footer's. */
  hideUntilFit?: boolean;
  letterClassName?: string;
};

const VariableTextProximity = ({
  label,
  fromWeight = 300,
  toWeight = 800,
  radius = 0.9,
  fill = 0.96,
  maxHeight = 0.34,
  wave = false,
  wavePeriod = 2600,
  className = "",
  wordClassName = "",
  hideUntilFit = false,
  letterClassName = "",
}: VariableTextProximityProps) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const word = wordRef.current;
    if (!box || !word) return;
    const letters = Array.from(word.querySelectorAll<HTMLElement>("[data-proximity-letter]"));
    const weight = (value: number) => `'wght' ${value}`;
    const reduced = prefersReducedMotion();
    let applied: number[] = [];

    // Each letter is held at its widest weight, so changing weight never reflows the word
    const fit = () => {
      word.style.fontSize = "100px";
      const widths = letters.map((letter) => {
        letter.style.width = "auto";
        letter.style.fontVariationSettings = weight(fromWeight);
        const from = letter.getBoundingClientRect().width;
        letter.style.fontVariationSettings = weight(toWeight);
        const to = letter.getBoundingClientRect().width;
        return Math.max(from, to);
      });
      widths.forEach((width, index) => {
        letters[index].style.width = `${width / 100}em`;
        letters[index].style.fontVariationSettings = weight(reduced ? (fromWeight + toWeight) / 2 : fromWeight);
      });
      // Letter boxes overlap by their negative side margins (room for overhanging glyphs)
      const overlap = letters.reduce((sum, letter) => {
        const style = getComputedStyle(letter);
        return sum + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }, 0);
      const total = widths.reduce((sum, width) => sum + width, 0) + overlap || 1;
      const byWidth = (box.clientWidth * fill * 100) / total;
      const byHeight = window.matchMedia("(min-width: 1024px)").matches ? window.innerHeight * maxHeight / 0.75 : byWidth;
      word.style.fontSize = `${Math.min(byWidth, byHeight)}px`;

      // A background on the letters (a gradient fill) is sized to the whole word and shifted
      // per letter, so it reads as one continuous fill rather than restarting on each glyph
      const first = letters[0]?.getBoundingClientRect().left ?? 0;
      const span = (letters.at(-1)?.getBoundingClientRect().right ?? 0) - first;
      const boxes = letters.map((letter) => letter.getBoundingClientRect());
      applied = [];
      letters.forEach((letter, index) => {
        letter.style.backgroundSize = `${span}px 100%`;
        letter.style.backgroundPosition = `${first - boxes[index].left}px 0`;
      });
      word.classList.remove("invisible");
    };

    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    if (reduced) return () => window.removeEventListener("resize", fit);

    // The pointer is tracked in viewport space and eased, so the weight wave trails it a little
    const target = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999 };
    const finePointer = hasFinePointer();
    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (eased.x < -9000) Object.assign(eased, target);
    };
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });

    let frame = 0;
    let visible = false;
    const start = performance.now();
    const tick = (now: number) => {
      frame = visible ? requestAnimationFrame(tick) : 0;
      const rect = word.getBoundingClientRect();
      const reach = parseFloat(word.style.fontSize) * radius;
      // The wave's crest travels from just before the first letter to just past the last
      const crest = rect.left - reach + (rect.width + reach * 2) * (((now - start) / wavePeriod) % 1);
      if (wave && !finePointer) {
        target.x = eased.x = -9999;
      } else if (!finePointer) {
        // Touch screens: an invisible cursor drifts back and forth along the word
        const phase = ((now - start) / 4200) % 2;
        const t = phase < 1 ? phase : 2 - phase;
        target.x = eased.x = rect.left + rect.width * (0.5 - 0.5 * Math.cos(Math.PI * t));
        target.y = eased.y = rect.top + rect.height * 0.55;
      } else {
        eased.x += (target.x - eased.x) * 0.14;
        eased.y += (target.y - eased.y) * 0.14;
      }
      const bump = (distance: number) => (distance >= reach ? 0 : (1 + Math.cos((Math.PI * distance) / reach)) / 2);
      // Measured every frame: a reveal can move the letters (the footer's rise in from below),
      // so positions taken once would leave the swell trailing where the letters used to be
      const boxes = letters.map((letter) => letter.getBoundingClientRect());
      letters.forEach((letter, index) => {
        const box = boxes[index];
        const centre = box.left + box.width / 2;
        const cursor = bump(Math.hypot(eased.x - centre, eased.y - (box.top + box.height / 2)));
        const strength = wave ? Math.max(cursor, bump(Math.abs(crest - centre))) : cursor;
        const value = Math.round(fromWeight + (toWeight - fromWeight) * strength);
        if (applied[index] === value) return;
        applied[index] = value;
        letter.style.fontVariationSettings = weight(value);
      });
    };

    // Only animate while the word is on screen
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(tick);
    });
    observer.observe(word);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", fit);
      window.removeEventListener("pointermove", onMove);
    };
  }, [fromWeight, toWeight, radius, fill, maxHeight, wave, wavePeriod]);

  return (
    <div ref={boxRef} className={className}>
      <div ref={wordRef} aria-hidden className={`flex justify-center whitespace-nowrap ${hideUntilFit ? "invisible" : ""} ${wordClassName}`.trim()}>
        {[...label].map((letter, index) => (
          // Side padding, cancelled by negative margins, gives glyphs like ® room to draw
          // past their advance width without a letter's background clipping them
          <span key={index} data-proximity-letter className={`-mx-[0.08em] inline-block px-[0.08em] text-center ${letterClassName}`}>
            {letter === " " ? " " : letter}
          </span>
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default VariableTextProximity;
