// Page changes freeze a copy of what's on screen, then the new page rises over it behind a
// slanted edge that flattens as it reaches the top, while the old page drifts up and tilts
// away. The Home page also opens with the stack loader, whose photos land on the hero's cards.

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../Animations/reducedMotion";
import { BASE, ROUTES } from "../../../routes";
import { BRAND } from "../../../brand";
import StackLoader, { stackLoaderPlaying } from "../stack-loader";
import { HERO_CARDS, HERO_CARD_SIZES } from "../../home/heroCards";

gsap.registerPlugin(ScrollTrigger);

export const COVERED_EVENT = "site:covered";

const RISE = { duration: 0.9, ease: "power3.inOut" };
const SLANT_LAG = 0.1;
const LIFT = { duration: RISE.duration + SLANT_LAG, ease: "power3.out" };
const LEAVE = { duration: 600, easing: "cubic-bezier(0.5, 1, 0.9, 1)" };
const DRIFT = { y: -0.14, rotation: -2.5, scale: 1.06, opacity: 0.7 };
const LEAVE_SHARE = 0.25;
const OUT_CUBIC = "cubic-bezier(0.3, 1, 0.7, 1)";

const drift = (share: number) => ({
  transform: `translate3d(0px, ${window.innerHeight * DRIFT.y * share}px, 0px) rotate(${DRIFT.rotation * share}deg) scale(${1 + (DRIFT.scale - 1) * share})`,
  opacity: String(1 - (1 - DRIFT.opacity) * share),
});

// Copies what's on screen of `source` into `frame`, in the same place. Pinned (sticky)
// elements are held where they're currently stuck, and 2D canvases are copied across, so the
// frozen page matches the live one exactly.
const freeze = (frame: HTMLElement, source: HTMLElement, clip?: string) => {
  const box = source.getBoundingClientRect();
  const originals = Array.from(source.querySelectorAll<HTMLElement>("*"));
  const stuck = originals.flatMap((element, index) => {
    if (getComputedStyle(element).position !== "sticky") return [];
    const now = element.getBoundingClientRect().top;
    const previous = element.style.position;
    element.style.position = "static";
    const inFlow = element.getBoundingClientRect().top;
    element.style.position = previous;
    return [{ index, offset: now - inFlow }];
  });

  const copy = source.cloneNode(true) as HTMLElement;
  copy.removeAttribute("id");
  copy.setAttribute("aria-hidden", "true");
  Object.assign(copy.style, {
    position: "absolute",
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    margin: "0",
    pointerEvents: "none",
    clipPath: clip ?? "none",
  });

  const copies = Array.from(copy.querySelectorAll<HTMLElement>("*"));
  stuck.forEach(({ index, offset }) => {
    Object.assign(copies[index].style, { position: "relative", top: `${offset}px` });
  });
  originals.forEach((element, index) => {
    if (element instanceof HTMLCanvasElement) {
      try {
        (copies[index] as HTMLCanvasElement).getContext("2d")?.drawImage(element, 0, 0);
      } catch {}
      return;
    }
    if (element instanceof HTMLVideoElement && element.readyState >= 2 && element.videoWidth) {
      const still = document.createElement("canvas");
      still.width = element.videoWidth;
      still.height = element.videoHeight;
      still.className = element.className;
      try {
        still.getContext("2d")?.drawImage(element, 0, 0);
        copies[index].replaceWith(still);
      } catch {}
    }
  });

  const vh = window.innerHeight;
  Array.from(source.children).forEach((child, index) => {
    const rect = child.getBoundingClientRect();
    if (!rect.height || (rect.bottom > 0 && rect.top < vh)) return;
    if (!["static", "relative"].includes(getComputedStyle(child).position)) return;
    const spacer = document.createElement("div");
    spacer.style.height = `${rect.height}px`;
    copy.children[index].replaceWith(spacer);
  });

  frame.appendChild(copy);
};

const PageTransition = () => {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const leavingRef = useRef(false);
  const failsafeRef = useRef<number | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const [firstPath] = useState(pathname);
  const [loaderActive] = useState(() => stackLoaderPlaying(ROUTES.home));

  const reveal = () => {
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    const main = document.querySelector<HTMLElement>(".raven-page > main");
    const footer = document.getElementById("footer");
    if (!backdrop || !frame || !main || !leavingRef.current) return;
    leavingRef.current = false;
    window.clearTimeout(failsafeRef.current);

    const hashTarget = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    if (hashTarget) {
      lenis?.scrollTo(hashTarget, { immediate: true, force: true });
      if (!lenis) hashTarget.scrollIntoView();
    } else {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    lenis?.start();

    const vh = window.innerHeight;
    const state = { left: vh * 1.05, right: vh * 1.4, y: vh * 0.12 };
    const paint = () => {
      main.style.transform = `translate3d(0px, ${state.y}px, 0px)`;
      backdrop.style.clipPath = `polygon(0px 0px, 100% 0px, 100% ${state.right + state.y}px, 0px ${state.left + state.y}px)`;
    };
    paint();

    const current = getComputedStyle(frame);
    const start = { transform: current.transform, opacity: current.opacity };
    frame.getAnimations().forEach((animation) => animation.cancel());
    frame.animate([start, drift(1)], { duration: LIFT.duration * 1000, easing: OUT_CUBIC, fill: "forwards" });

    gsap
      .timeline({
        onUpdate: paint,
        onComplete: () => {
          main.style.transform = "";
          main.style.willChange = "";
          if (footer) footer.style.visibility = "";
          backdrop.style.clipPath = "";
          gsap.set(backdrop, { display: "none" });
          frame.getAnimations().forEach((animation) => animation.cancel());
          frame.replaceChildren();
          requestAnimationFrame(() => ScrollTrigger.refresh());
        },
      })
      .to(state, { left: 0, ...RISE }, 0)
      .to(state, { right: 0, ...RISE }, SLANT_LAG)
      .to(state, { y: 0, ...LIFT }, 0);
  };

  useEffect(() => {
    const backdrop = backdropRef.current;
    const frame = frameRef.current;
    if (!backdrop || !frame) return;

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        leavingRef.current ||
        prefersReducedMotion()
      ) {
        return;
      }

      const anchor = (event.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        // Links that run their own transition opt out
        anchor.hasAttribute("data-raven-no-transition")
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith(BASE)) return;
      if (url.pathname === window.location.pathname) return;

      const main = document.querySelector<HTMLElement>(".raven-page > main");
      if (!main) return;

      event.preventDefault();
      leavingRef.current = true;
      window.dispatchEvent(new Event(COVERED_EVENT));

      gsap.set(backdrop, { display: "block" });
      freeze(frame, main);
      const footer = document.getElementById("footer");
      const footerPanel = footer?.querySelector<HTMLElement>("footer");
      if (footer && footerPanel) {
        const outer = footer.getBoundingClientRect();
        if (outer.top < window.innerHeight && outer.bottom > 0) {
          const panelBox = footerPanel.getBoundingClientRect();
          freeze(frame, footerPanel, `inset(${Math.max(0, outer.top - panelBox.top)}px 0px 0px 0px)`);
        }
        footer.style.visibility = "hidden";
      }
      main.style.willChange = "transform";
      lenis?.stop();

      const destination = url.pathname + url.search + url.hash;
      const vh = window.innerHeight;
      frame.style.transformOrigin = "50% 100%";
      frame.animate([drift(0), drift(LEAVE_SHARE)], { ...LEAVE, fill: "forwards" });
      router.push(destination);
      failsafeRef.current = window.setTimeout(reveal, 3500);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, lenis]);

  useEffect(() => {
    if (!leavingRef.current) return;
    let frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(reveal);
    });
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <noscript>
        <style>{`[data-raven-transition]{display:none!important}`}</style>
      </noscript>

      <div ref={backdropRef} aria-hidden className="pointer-events-none fixed inset-0 z-3 hidden overflow-hidden bg-(--raven-ink)">
        <div ref={frameRef} className="absolute inset-0 origin-center overflow-hidden bg-(--raven-paper) will-change-transform" />
      </div>

      {firstPath === ROUTES.home && (
        <StackLoader
          data-raven-transition
          active={loaderActive}
          images={HERO_CARDS.map((card) => ({ src: card.image, alt: card.alt }))}
          leading="Brands People"
          trailing="Stop For."
          caption={`A brand and digital studio in ${BRAND.cities}`}
          target="[data-hero-card]"
          sizes={HERO_CARD_SIZES}
        />
      )}
    </>
  );
};

export default PageTransition;
