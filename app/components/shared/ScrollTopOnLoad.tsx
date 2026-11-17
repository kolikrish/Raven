
"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

// Runs as soon as this module loads, before React hydrates, so the browser doesn't restore
// the old scroll position first. (An inline <script> did this before, but React warns when
// it has to render a script tag in the browser, as it does on the 404 page.)
if (typeof window !== "undefined") {
  try {
    if (!window.location.hash) window.history.scrollRestoration = "manual";
  } catch {}
}

export default function ScrollTopOnLoad() {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const scrollToTop = () => {
      lenis?.scrollTo?.(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };

    scrollToTop();

    const rafOne = requestAnimationFrame(scrollToTop);
    const rafTwo = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });
    const timeout = window.setTimeout(scrollToTop, 150);

    window.addEventListener("load", scrollToTop);

    return () => {
      cancelAnimationFrame(rafOne);
      cancelAnimationFrame(rafTwo);
      window.clearTimeout(timeout);
      window.removeEventListener("load", scrollToTop);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [lenis]);

  return null;
}
