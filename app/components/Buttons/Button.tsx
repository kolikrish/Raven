// The site's button is the Vault "arrow fill button": an arrow in a circle at the right end
// that grows to flood the whole pill on hover, while a second copy of the label (clipped to
// the circle) takes over in the flood colour and the arrow slides through.

"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { ArrowRight } from "lucide-react";
import { useMagnetic } from "../Animations/useMagnetic";
import { titleCase } from "../../titleCase";

type Variant = "primary" | "outline";
// light: on paper, ink: on ink, media: over photos, accent: an accent button on paper,
// blue: on the accent-coloured menu and footer
type Tone = "light" | "ink" | "media" | "accent" | "blue";
type Size = "md" | "sm";

type ButtonProps = {
  label: string;
  href?: string;
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  // Kept for compatibility: every button now carries the arrow circle
  icon?: boolean;
  // Full width, with the label centred across the whole pill
  full?: boolean;
  magnetic?: number;
  className?: string;
  type?: "button" | "submit";
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

// The resting colours, the colour the circle floods with, and the label/arrow colour on it
const LOOKS: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "[--btn-bg:var(--raven-ink)] [--btn-text:var(--raven-paper)] [--btn-fill:var(--raven-accent)] [--btn-fill-text:var(--raven-white)] border-transparent",
    outline: "[--btn-bg:transparent] [--btn-text:var(--raven-ink)] [--btn-fill:var(--raven-ink)] [--btn-fill-text:var(--raven-paper)] border-(--raven-ink)/25",
  },
  ink: {
    primary: "[--btn-bg:var(--raven-paper)] [--btn-text:var(--raven-ink)] [--btn-fill:var(--raven-accent)] [--btn-fill-text:var(--raven-white)] border-transparent",
    outline: "[--btn-bg:transparent] [--btn-text:var(--raven-paper)] [--btn-fill:var(--raven-paper)] [--btn-fill-text:var(--raven-ink)] border-(--raven-white)/20",
  },
  media: {
    primary: "[--btn-bg:var(--raven-paper)] [--btn-text:var(--raven-ink)] [--btn-fill:var(--raven-accent)] [--btn-fill-text:var(--raven-white)] border-transparent",
    outline: "[--btn-bg:transparent] [--btn-text:var(--raven-white)] [--btn-fill:var(--raven-white)] [--btn-fill-text:var(--raven-ink)] border-(--raven-white)/50",
  },
  accent: {
    primary: "[--btn-bg:var(--raven-accent)] [--btn-text:var(--raven-white)] [--btn-fill:var(--raven-white)] [--btn-fill-text:var(--raven-accent)] border-transparent",
    outline: "[--btn-bg:transparent] [--btn-text:var(--raven-accent)] [--btn-fill:var(--raven-accent)] [--btn-fill-text:var(--raven-white)] border-(--raven-accent)/40",
  },
  blue: {
    primary: "[--btn-bg:var(--raven-white)] [--btn-text:var(--raven-accent)] [--btn-fill:var(--raven-ink)] [--btn-fill-text:var(--raven-white)] border-transparent",
    outline: "[--btn-bg:transparent] [--btn-text:var(--raven-white)] [--btn-fill:var(--raven-white)] [--btn-fill-text:var(--raven-accent)] border-(--raven-white)/40",
  },
};

// The circle sits inset from the end of the pill
const SIZE: Record<Size, string> = {
  md: "text-22 [--btn-h:6.4vh] [--icon-right:0.4vw] [--pad:2vw] max-lg:[--btn-h:6.2vh] max-lg:[--icon-right:0.9vw] max-lg:[--pad:4vw] max-md:[--btn-h:7vh] max-md:[--icon-right:1.4vw] max-md:[--pad:6vw]",
  sm: "text-22 [--btn-h:5.5vh] [--icon-right:0.4vw] [--pad:1.6vw] max-lg:[--btn-h:5.7vh] max-lg:[--icon-right:0.8vw] max-lg:[--pad:3.4vw] max-md:[--btn-h:6.4vh] max-md:[--icon-right:1.2vw] max-md:[--pad:5.4vw]",
};

const MOTION = "transition-all duration-450 ease-[cubic-bezier(0.8,0.1,0.2,0.9)] motion-reduce:transition-none";
const ON = "group-hover:[clip-path:inset(0_0_0_0)] group-data-[pressed=true]:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]";

const Button = ({
  label: text,
  href,
  variant = "primary",
  tone = "light",
  size = "md",
  full = false,
  magnetic = 0.3,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) => {
  // Every button label follows the site's title case
  const label = titleCase(text);
  const ref = useRef<HTMLElement | null>(null);
  const lenis = useLenis();
  const [ready, setReady] = useState(false);
  const [pressed, setPressed] = useState(false);
  const releaseRef = useRef<number | null>(null);
  // A full-width button stays put: any pull reads as the button sliding out of its layout
  useMagnetic(ref, full ? 0 : magnetic);
  const look = LOOKS[tone][variant];

  // Transitions switch on after the first frame, so nothing animates in on page load
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => {
      cancelAnimationFrame(frame);
      if (releaseRef.current) window.clearTimeout(releaseRef.current);
    };
  }, []);

  // Touch screens have no hover: a press plays the fill, and it lets go once it has finished
  const press = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    if (releaseRef.current) window.clearTimeout(releaseRef.current);
    setPressed(true);
  };
  const release = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    releaseRef.current = window.setTimeout(() => setPressed(false), 450);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !href || !href.startsWith("#") || href.length < 2) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.5 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  // The circle's box, as an inset from each edge of the pill
  const CIRCLE = "[--icon-circle:calc(var(--btn-h)-var(--icon-right)*2)] [--circle-y:calc((100%-var(--icon-circle))/2)]";
  // Room on the right for the circle; a full-width button pads both sides equally so the
  // label sits in the true centre
  const PADDING = full
    ? "px-[calc(var(--icon-circle)+var(--icon-right)+var(--pad)*3/4)]"
    : "px-(--pad) after:w-[calc(var(--icon-circle)+var(--icon-right)-var(--pad)/4)] after:shrink-0 after:content-['']";

  const classes = `group relative isolate inline-flex h-(--btn-h) shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-full border bg-(--btn-bg) font-raven-head font-medium leading-none text-(color:--btn-text) outline-offset-4 ${full ? "w-full" : "w-fit max-md:min-w-[38vw]"} ${SIZE[size]} ${CIRCLE} ${PADDING} ${look} ${className}`.trim();

  const content = (
    <>
      <span aria-hidden className="relative z-1">
        {label}
      </span>

      {/* The flood: starts as the arrow's circle and grows to the whole pill, over the border too
          so no dark edge shows round a flooded button */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-[var(--circle-y)_var(--icon-right)_var(--circle-y)_calc(100%-var(--icon-right)-var(--icon-circle))] z-2 rounded-full bg-(--btn-fill) ${
          ready ? `${MOTION} group-hover:-inset-px group-data-[pressed=true]:-inset-px group-focus-visible:-inset-px` : ""
        }`}
      />

      {/* The label again in the flood colour, revealed through the growing circle */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-2 flex items-center justify-center text-(color:--btn-fill-text) [clip-path:inset(var(--circle-y)_var(--icon-right)_var(--circle-y)_calc(100%-var(--icon-right)-var(--icon-circle)))] ${PADDING} ${
          ready ? `${MOTION} ${ON}` : ""
        }`}
      >
        <span className="relative z-1">{label}</span>
      </span>

      {/* The arrow: one slides out to the right as the next slides in from the left */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-(--icon-right) top-1/2 z-3 inline-flex size-(--icon-circle) -translate-y-1/2 items-center justify-center overflow-hidden rounded-full text-(color:--btn-fill-text)"
      >
        <ArrowRight
          strokeWidth={1.8}
          className={`absolute left-1/2 top-1/2 size-[42%] -translate-y-1/2 translate-x-[-170%] scale-0 ${
            ready ? `${MOTION} group-hover:-translate-x-1/2 group-hover:scale-100 group-data-[pressed=true]:-translate-x-1/2 group-data-[pressed=true]:scale-100 group-focus-visible:-translate-x-1/2 group-focus-visible:scale-100` : ""
          }`}
        />
        <ArrowRight
          strokeWidth={1.8}
          className={`absolute left-1/2 top-1/2 size-[42%] -translate-x-1/2 -translate-y-1/2 ${
            ready ? `${MOTION} group-hover:translate-x-[70%] group-hover:scale-0 group-data-[pressed=true]:translate-x-[70%] group-data-[pressed=true]:scale-0 group-focus-visible:translate-x-[70%] group-focus-visible:scale-0` : ""
          }`}
        />
      </span>
    </>
  );

  const shared = {
    className: classes,
    "data-pressed": pressed ? "true" : "false",
    onPointerDown: press,
    onPointerUp: release,
    onPointerCancel: release,
    onClick: handleClick,
    "aria-label": label,
    // Buttons show their own hover; the cursor's blend would tint the fill
    "data-cursor-quiet": "",
  };

  if (!href) {
    return (
      <button
        ref={(el) => {
          ref.current = el;
        }}
        type={type}
        {...shared}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      ref={(el) => {
        ref.current = el;
      }}
      href={href}
      {...shared}
    >
      {content}
    </Link>
  );
};

export default Button;
