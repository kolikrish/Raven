
"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { hasFinePointer, prefersReducedMotion } from "./reducedMotion";

export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  strength = 0.3,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !strength || !hasFinePointer() || prefersReducedMotion()) return;

    const moveX = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // The pull is capped by the element's height, so a wide element (a full-width button)
      // only nudges instead of sliding a long way towards the pointer
      const limit = rect.height * strength * 1.5;
      const clamp = (value: number) => Math.max(-limit, Math.min(limit, value));
      moveX(clamp((event.clientX - rect.left - rect.width / 2) * strength));
      moveY(clamp((event.clientY - rect.top - rect.height / 2) * strength));
    };

    const handleLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      gsap.set(el, { clearProps: "x,y" });
    };
  }, [ref, strength]);
}
