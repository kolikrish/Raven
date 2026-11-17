
"use client";

import { useEffect, useState, type RefObject } from "react";

// True once the page has finished loading (plus an idle moment), or earlier if `near` comes
// within `margin` of the viewport. Media that sits far down the page waits for this, so it
// doesn't compete with the first screen's images, fonts and scripts for bandwidth.
export function useAfterLoad(near?: RefObject<Element | null>, margin = "200% 0px") {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    let idleId: number | undefined;
    const done = () => setReady(true);
    const idle = () => {
      const request = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idleId = request(done, { timeout: 1500 } as IdleRequestOptions);
    };

    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    let observer: IntersectionObserver | undefined;
    const el = near?.current;
    if (el && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) done();
        },
        { rootMargin: margin },
      );
      observer.observe(el);
    }

    return () => {
      window.removeEventListener("load", idle);
      if (idleId !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
      observer?.disconnect();
    };
  }, [ready, near, margin]);

  return ready;
}
