
"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FadeUp, RuleDraw } from "../Animations/gsapAnim";
import { hasFinePointer, prefersReducedMotion } from "../Animations/reducedMotion";
import { ArrowUpRight } from "../Buttons/icons";
import { ROUTES } from "../../routes";
import awwwards from "../../assets/awards/award-awwwards.webp";
import cannesLions from "../../assets/awards/award-cannes-lions.webp";
import europeanDesign from "../../assets/awards/award-european-design.webp";
import pentawards from "../../assets/awards/award-pentawards.webp";
import dandad from "../../assets/awards/award-dandad.webp";
import webby from "../../assets/awards/award-webby.webp";
import tdc from "../../assets/awards/award-tdc.webp";

gsap.registerPlugin(useGSAP);

// Each award names the project it was for (a title from projects.ts) and shows its trophy,
// cut out on a transparent background (src/assets/awards)
const ROWS = [
  { year: "2026", name: "Awwwards, Site of the Month", project: "Fjellform", trophy: awwwards },
  { year: "2026", name: "Cannes Lions, Silver", project: "Maré", trophy: cannesLions },
  { year: "2026", name: "European Design Awards, Gold", project: "Ferja", trophy: europeanDesign },
  { year: "2025", name: "Pentawards, Gold", project: "Sardinha Atlântica", trophy: pentawards },
  { year: "2025", name: "D&AD, Graphite Pencil", project: "Nordvind", trophy: dandad },
  { year: "2025", name: "Webby Awards, Honoree", project: "Puls", trophy: webby },
  { year: "2024", name: "Type Directors Club, Judges’ Choice", project: "Kvist", trophy: tdc },
];

const SHOWN = "inset(0% 0% 0% 0%)";
const HIDDEN = "inset(100% 0% 0% 0%)";
const GONE = "inset(0% 0% 100% 0%)";

// The awards as an index of rows. On desktop, hovering a row brings up the trophy on a dark card
// that follows the pointer; on touch screens each row shows a small trophy instead. Each row
// leads to the Work page for more project examples.
const AwardsIndex = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(-1);
  const moveRef = useRef<{ x: (value: number) => void; y: (value: number) => void } | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);

  // Shows the card for row `index` (-1 hides it). It only reads refs, so it never changes.
  const show = useCallback((index: number) => {
    const frame = frameRef.current;
    if (!frame || !hasFinePointer()) return;
    const fast = prefersReducedMotion();
    const previous = activeRef.current;
    activeRef.current = index;

    // Every tween here overwrites whatever is still running on the same element ("auto" on the
    // card, so only its fade and scale are replaced and the follow keeps running), so moving
    // quickly between rows (or out of the list mid-animation) can't leave an older tween to
    // finish later and bring a card or trophy back
    if (index === -1) {
      gsap.to(frame, { scale: 0.6, autoAlpha: 0, duration: fast ? 0 : 0.4, ease: "power3.out", overwrite: "auto" });
      return;
    }
    gsap.to(frame, { scale: 1, autoAlpha: 1, duration: fast ? 0 : 0.5, ease: "power3.out", overwrite: "auto" });
    if (previous === index) return;

    // The trophies are cut out (transparent), so the new one can't simply cover the last: the
    // last one wipes away upwards while the new one wipes in from below. Every other trophy
    // is stopped and put away at once.
    imageRefs.current.forEach((image, i) => {
      if (!image || i === index || i === previous) return;
      gsap.killTweensOf(image);
      gsap.set(image, { clipPath: HIDDEN, zIndex: 0 });
    });
    const last = previous >= 0 ? imageRefs.current[previous] : null;
    if (last) {
      gsap.set(last, { zIndex: 1 });
      gsap.to(last, { clipPath: GONE, duration: fast ? 0 : 0.5, ease: "power3.out", overwrite: true });
    }
    const next = imageRefs.current[index];
    if (next) {
      gsap.set(next, { zIndex: 2 });
      gsap.fromTo(next, { clipPath: HIDDEN }, { clipPath: SHOWN, duration: fast ? 0 : 0.6, ease: "power3.out", overwrite: true });
      gsap.fromTo(next.querySelector("img"), { scale: 1.3 }, { scale: 1, duration: fast ? 0 : 0.9, ease: "power3.out", overwrite: true });
    }
  }, []);

  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame || !hasFinePointer()) return;
      gsap.set(frame, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
      gsap.set(imageRefs.current, { clipPath: HIDDEN });
      const fast = prefersReducedMotion();
      moveRef.current = {
        x: gsap.quickTo(frame, "x", { duration: fast ? 0 : 0.7, ease: "power3.out" }),
        y: gsap.quickTo(frame, "y", { duration: fast ? 0 : 0.7, ease: "power3.out" }),
      };

      // Scrolling the list away from a still mouse never fires pointerleave, so check on scroll
      // whether the pointer is still over the list and put the card away if not
      const onScroll = () => {
        if (activeRef.current !== -1 && !listRef.current?.matches(":hover")) show(-1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: rootRef },
  );

  const follow = (event: PointerEvent) => {
    const root = rootRef.current;
    if (!root || !moveRef.current || event.pointerType !== "mouse") return;
    const box = root.getBoundingClientRect();
    moveRef.current.x(event.clientX - box.left);
    moveRef.current.y(event.clientY - box.top);
  };


  return (
    <div ref={rootRef} onPointerMove={follow} className="relative flex flex-col gap-4 max-lg:gap-2">
      <FadeUp aria-hidden className="grid grid-cols-12 gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 text-14 text-raven-muted max-md:hidden">
        <span className="col-span-2">Year</span>
        <span className="col-span-6">Award</span>
        <span className="col-span-4">Project</span>
      </FadeUp>

      <ol ref={listRef} onPointerLeave={() => show(-1)}>
        {ROWS.map((award, index) => (
          <FadeUp as="li" key={`${award.year}-${award.name}`} delay={index * 0.1} className="relative">
            {index === 0 && <RuleDraw syncWithFade className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />}
            <RuleDraw syncWithFade delay={index * 0.1} className="absolute inset-x-0 bottom-0 h-px bg-(--raven-ink)/15" />
            <Link
              href={ROUTES.work}
              data-cursor-quiet
              onPointerEnter={() => show(index)}
              onFocus={() => show(index)}
              onBlur={() => show(-1)}
              className="group grid grid-cols-12 items-baseline gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 py-[1.4vw] max-lg:py-5 max-md:grid-cols-[1fr_auto] max-md:gap-y-1"
            >
              <span className="col-span-2 text-22 tabular-nums text-raven-muted max-md:col-span-1 max-md:text-14">{award.year}</span>
              <span className="font-raven-head col-span-6 text-30 font-medium tracking-tight transition-[translate,color] duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:translate-x-[0.8vw] group-hover:text-(color:--raven-accent) max-md:col-span-1">
                {award.name}
              </span>
              <span className="col-span-3 text-22 text-raven-muted max-md:col-span-1 max-md:row-start-3">{award.project}</span>
              <ArrowUpRight className="col-span-1 size-[1.2vw] justify-self-end transition-transform duration-500 group-hover:rotate-45 max-lg:hidden" />
              <span aria-hidden className="relative hidden size-16 justify-self-end self-center max-lg:col-span-1 max-lg:block max-md:col-start-2 max-md:row-span-3 max-md:row-start-1 max-md:size-14">
                <Image src={award.trophy} alt={`${award.name} trophy`} fill sizes="64px" className="object-contain" />
              </span>
            </Link>
          </FadeUp>
        ))}
      </ol>

      {/* The floating trophy card (desktop pointers only): a dark card with a soft blue glow
          behind the trophy */}
      <div
        ref={frameRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-10 aspect-4/5 w-[16vw] overflow-hidden rounded-lg max-lg:rounded-sm max-md:rounded-xs bg-(--raven-ink) shadow-[0_2vw_4vw_-1.5vw_rgb(8_7_8/0.5)] max-lg:hidden"
      >
        <span className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,color-mix(in_srgb,var(--raven-accent)_38%,transparent),transparent)]" />
        {ROWS.map((award, index) => (
          <div
            key={award.name}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            className="absolute inset-0 overflow-hidden [clip-path:inset(100%_0%_0%_0%)]"
          >
            <div className="absolute inset-[14%]">
              <Image src={award.trophy} alt={`${award.name} trophy`} fill sizes="20vw" className="object-contain drop-shadow-[0_1.2vw_1.2vw_rgb(0_0_0/45%)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwardsIndex;
