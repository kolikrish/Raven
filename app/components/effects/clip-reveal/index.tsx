// The site's image reveal: the frame grows out of a bottom corner while the picture inside
// eases down from a zoom. Frames on the left half of the screen open from the bottom left,
// frames on the right from the bottom right, so side-by-side pictures open toward each other.
// It plays once when the frame scrolls into view, or follows the scroll when `scrub` is set.

"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../Animations/reducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// inset(top right bottom left): shut against the bottom-left or bottom-right corner
const FROM_LEFT = "inset(100% 100% 0% 0%)";
const FROM_RIGHT = "inset(100% 0% 0% 100%)";
const OPEN = "inset(0% 0% 0% 0%)";

type ClipRevealProps = {
  /** Which bottom corner the frame grows from; by default the one nearer the frame */
  corner?: "left" | "right";
  scrub?: boolean;
  start?: string;
  end?: string;
  duration?: number;
  /** Seconds to wait after the frame scrolls in, to stagger a row of frames */
  delay?: number;
  className?: string;
  children?: ReactNode;
};

const ClipReveal = ({
  corner,
  scrub = false,
  start = "top 85%",
  end = "top 30%",
  duration = 1.6,
  delay = 0,
  className = "",
  children,
}: ClipRevealProps) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const frame = frameRef.current;
      const zoom = zoomRef.current;
      if (!frame || !zoom || prefersReducedMotion()) return;

      const box = frame.getBoundingClientRect();
      const side = corner ?? (box.left + box.width / 2 > window.innerWidth / 2 ? "right" : "left");

      const timeline = gsap.timeline({
        paused: !scrub,
        scrollTrigger: scrub
          ? { trigger: frame, start, end, scrub: true, invalidateOnRefresh: true }
          : { trigger: frame, start, once: true, onEnter: () => gsap.delayedCall(delay, () => timeline.play()) },
      });
      timeline
        .fromTo(
          frame,
          { clipPath: side === "right" ? FROM_RIGHT : FROM_LEFT },
          { clipPath: OPEN, duration, ease: scrub ? "none" : "expo.inOut" },
        )
        .fromTo(
          zoom,
          { scale: 1.45, transformOrigin: side === "right" ? "100% 100%" : "0% 100%" },
          { scale: 1, duration: duration * 1.25, ease: scrub ? "none" : "expo.out" },
          scrub ? 0 : duration * 0.15,
        );
    },
    { scope: frameRef, dependencies: [corner, scrub, start, end, duration, delay] },
  );

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`.trim()}>
      <div ref={zoomRef} className="relative h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
};

export default ClipReveal;
