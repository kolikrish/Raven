// A soft beam of accent-coloured light drifting through a dark panel. Two long elliptical glows
// sit on a diagonal and wander slowly on their own; while the pointer is over the panel they
// lean gently towards it. Only transforms move, so it stays cheap to animate.

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { hasFinePointer, prefersReducedMotion } from "../../Animations/reducedMotion";

gsap.registerPlugin(useGSAP);

type DriftingLightProps = {
  className?: string;
};

const DriftingLight = ({ className = "" }: DriftingLightProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const followRef = useRef<HTMLDivElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const follow = followRef.current;
      const beam = beamRef.current;
      const glow = glowRef.current;
      if (!root || !follow || !beam || !glow) return;
      if (prefersReducedMotion()) {
        gsap.set(beam, { rotate: -28 });
        return;
      }

      // The beam swings slowly across the panel and back; the softer glow drifts against it
      const drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
      drift
        .fromTo(beam, { xPercent: -18, yPercent: 6, rotate: -32 }, { xPercent: 26, yPercent: -4, rotate: -22, duration: 9 }, 0)
        .fromTo(glow, { xPercent: 20, yPercent: -6, scale: 1 }, { xPercent: -16, yPercent: 8, scale: 1.15, duration: 11 }, 0);

      if (!hasFinePointer()) return () => drift.kill();

      // While the pointer is over the panel, the light leans a little towards it
      const moveX = gsap.quickTo(follow, "x", { duration: 2.4, ease: "power3.out" });
      const moveY = gsap.quickTo(follow, "y", { duration: 2.4, ease: "power3.out" });
      const handleMove = (event: PointerEvent) => {
        const box = root.getBoundingClientRect();
        moveX((event.clientX - box.left - box.width / 2) * 0.25);
        moveY((event.clientY - box.top - box.height / 2) * 0.25);
      };
      const handleLeave = () => {
        moveX(0);
        moveY(0);
      };
      const parent = root.parentElement ?? root;
      parent.addEventListener("pointermove", handleMove);
      parent.addEventListener("pointerleave", handleLeave);

      return () => {
        drift.kill();
        parent.removeEventListener("pointermove", handleMove);
        parent.removeEventListener("pointerleave", handleLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden className={`pointer-events-none overflow-hidden ${className}`.trim()}>
      <div ref={followRef} className="absolute inset-0">
        {/* The beam: a long ellipse of light, tilted onto a diagonal */}
        <div
          ref={beamRef}
          className="absolute left-[2%] top-[-30%] h-[170%] w-[72%] will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, color-mix(in srgb, var(--raven-accent) 55%, transparent) 0%, color-mix(in srgb, var(--raven-accent-deep) 35%, transparent) 40%, transparent 72%)",
          }}
        />
        {/* A wider, dimmer glow that keeps the dark from going flat */}
        <div
          ref={glowRef}
          className="absolute bottom-[-40%] left-[-15%] h-[100%] w-[85%] will-change-transform"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, color-mix(in srgb, var(--raven-accent-deep) 45%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
};

export default DriftingLight;
