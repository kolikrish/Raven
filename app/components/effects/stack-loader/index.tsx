"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { useLenis } from "lenis/react";
import ServerInlineScript from "../../shared/ServerInlineScript";

gsap.registerPlugin(useGSAP, SplitText);

const EASE = "power4.out";
const TEXT_TILT = 90;
const TEXT_STAGGER = 0.08;
const STACK_SCALE_STEP = 0.15;
const STACK_Y_STEP = 20;
const SPREAD_Y_STEP = 110;

export const STACK_LOADER_HANDOFF = 3.7;

// Fired on window when the loader finishes; smooth scroll resumes on it.
export const STACK_LOADER_DONE = "raven:loader-done";

// While the loader plays the page can't scroll: this attribute blocks native scrolling
// (see raven-styles.css) until Lenis has loaded and can be stopped itself.
const LOCK = "data-raven-loading";

// Runs from the server HTML before the first paint, so the page is locked even before the
// scripts load. Skipped for reduced motion (no loader); unlocks itself if the loader never runs.
const LOCK_EARLY = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.setAttribute("${LOCK}","");setTimeout(function(){d.removeAttribute("${LOCK}")},9000)}`;

const CARD_ENTRY = [
  "animate-[raven-loader-rise_1.1s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]",
  "animate-[raven-loader-rise_1.1s_cubic-bezier(0.16,1,0.3,1)_0.16s_both]",
  "animate-[raven-loader-rise_1.1s_cubic-bezier(0.16,1,0.3,1)_0.22s_both]",
  "animate-[raven-loader-rise_1.1s_cubic-bezier(0.16,1,0.3,1)_0.28s_both]",
  "animate-[raven-loader-rise_1.1s_cubic-bezier(0.16,1,0.3,1)_0.34s_both]",
  "animate-[raven-loader-rise_1.1s_cubic-bezier(0.16,1,0.3,1)_0.4s_both]",
];
const TEXT_ENTRY = "animate-[raven-loader-fade_0.9s_cubic-bezier(0.16,1,0.3,1)_0.3s_both] motion-reduce:animate-none";

const ENTRY_FALLBACK = 1.4;

const state = { decided: false, playing: false, lead: null as number | null };

export function stackLoaderPlaying(path: string) {
  if (typeof window === "undefined") return false;
  if (!state.decided) {
    state.decided = true;
    const here = window.location.pathname.replace(/\/$/, "");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
    state.playing = here === path.replace(/\/$/, "") && !reduce;
  }
  return state.playing;
}

// True while the Home loader is on screen (anything that would restart scrolling waits for it)
export const stackLoaderActive = () => state.playing;

export function stackLoaderLead() {
  if (state.lead !== null) return state.lead;
  if (typeof document === "undefined" || !document.getAnimations) return 0;
  const now = performance.now();
  const entries = document.getAnimations().filter((animation) => (animation as CSSAnimation).animationName?.startsWith("raven-loader-"));
  const ends = entries.map((animation) => {
    const start = animation.startTime;
    const end = Number(animation.effect?.getComputedTiming().endTime ?? 0);
    return start === null ? now + ENTRY_FALLBACK * 1000 : Number(start) + end;
  });
  state.lead = ends.length ? Math.max(0, (Math.max(...ends) - now) / 1000) : 0;
  return state.lead;
}

const settle = (element: HTMLElement) => {
  element.style.animation = "none";
  element.style.translate = "none";
  element.style.scale = "none";
  element.style.opacity = "1";
};

type StackLoaderImage = { src: StaticImageData; alt: string };

type StackLoaderProps = {
  active: boolean;
  images: StackLoaderImage[];
  leading: string;
  trailing: string;
  caption: string;
  target: string;
  sizes?: string;
  quality?: number;
  onComplete?: () => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

const StackLoader = ({ active, images, leading, trailing, caption, target, sizes = "60vw", quality = 90, onComplete, ...props }: StackLoaderProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const leadingRef = useRef<HTMLParagraphElement | null>(null);
  const trailingRef = useRef<HTMLParagraphElement | null>(null);
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const lenis = useLenis();

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Lenis mounts after the loader has started, so it is stopped as soon as it exists
  // and started again when the loader is done.
  useEffect(() => {
    if (!lenis || !state.playing) return;
    lenis.stop();
    const resume = () => lenis.start();
    window.addEventListener(STACK_LOADER_DONE, resume, { once: true });
    return () => window.removeEventListener(STACK_LOADER_DONE, resume);
  }, [lenis]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const backdrop = backdropRef.current;
      const texts = [leadingRef.current, trailingRef.current, captionRef.current];
      if (!root || !backdrop || texts.some((text) => !text)) return;
      const landing = Array.from(document.querySelectorAll<HTMLElement>(target));

      const finish = () => {
        state.playing = false;
        document.documentElement.removeAttribute(LOCK);
        gsap.set(landing, { autoAlpha: 1 });
        gsap.set(root, { display: "none" });
        window.dispatchEvent(new Event(STACK_LOADER_DONE));
        onCompleteRef.current?.();
      };

      if (!active) {
        finish();
        return;
      }

      document.documentElement.setAttribute(LOCK, "");

      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-loader-card]", root);
      const lead = stackLoaderLead();
      gsap.set(cards, { transformOrigin: "50% 50%", zIndex: (index: number) => index });

      const first = SplitText.create(leadingRef.current, { type: "words", aria: "none" });
      const trail = SplitText.create(trailingRef.current, { type: "words", aria: "none" });
      const note = SplitText.create(captionRef.current, { type: "lines", aria: "none" });
      const words = [...first.words, ...trail.words];
      gsap.set([...words, ...note.lines], { transformPerspective: 1000 });

      const total = cards.length;
      const spread = SPREAD_Y_STEP * (total - 1);
      const canLand = landing.length === total;

      const box = (index: number) => {
        const card = landing[index];
        const parent = card?.offsetParent as HTMLElement | null;
        const rect = parent?.getBoundingClientRect();
        return {
          left: (rect?.left ?? 0) + (card?.offsetLeft ?? 0),
          top: (rect?.top ?? 0) + (card?.offsetTop ?? 0),
          width: card?.offsetWidth ?? 0,
          height: card?.offsetHeight ?? 0,
        };
      };

      const tl = gsap.timeline({ delay: lead, onComplete: finish });

      tl.call(() => [...cards, ...(texts as HTMLElement[])].forEach(settle), [], 0)
        .to(
          cards,
          {
            scale: (index: number) => 1 + index * STACK_SCALE_STEP,
            yPercent: (index: number) => -index * STACK_Y_STEP,
            duration: 1,
            stagger: { each: 0.01, from: "end" },
            ease: "power3.inOut",
          },
          0.2,
        )
        .to(
          cards,
          {
            scale: 1,
            yPercent: (index: number) => -spread / 2 + index * SPREAD_Y_STEP,
            duration: 1,
            stagger: { each: 0.01, from: "end" },
            ease: "power3.inOut",
          },
          1.4,
        )
        .to(note.lines, { rotateX: TEXT_TILT, opacity: 0, transformOrigin: "50% 0%", duration: 0.8, ease: EASE }, 1.3)
        .to(words, { rotateX: TEXT_TILT, opacity: 0, transformOrigin: "50% 0%", duration: 0.5, stagger: TEXT_STAGGER, ease: EASE }, 2.4)
        // The page's own cards sit under the opaque backdrop until now; hide them before the
        // backdrop starts to fade (2.9), and finish() shows them once the photos have landed
        .set(landing, { autoAlpha: 0 }, 2.5);

      if (canLand) {
        tl.call(
          () => {
            cards.forEach((card, index) => {
              gsap.set(card, { left: card.offsetLeft, top: card.offsetTop, right: "auto", bottom: "auto", margin: 0, zIndex: total * 2 - index });
            });
          },
          [],
          2.5,
        )
          .to(
            cards,
            {
              left: (index: number) => box(index).left,
              top: (index: number) => box(index).top,
              width: (index: number) => box(index).width,
              height: (index: number) => box(index).height,
              yPercent: 0,
              scale: 1,
              x: (index: number) => Number(gsap.getProperty(landing[index], "x")),
              y: (index: number) => Number(gsap.getProperty(landing[index], "y")),
              rotation: (index: number) => Number(gsap.getProperty(landing[index], "rotation")),
              borderRadius: (index: number) => getComputedStyle(landing[index]).borderRadius,
              boxShadow: (index: number) => getComputedStyle(landing[index]).boxShadow,
              duration: 1.1,
              stagger: { each: 0.03, from: "end" },
              ease: "power3.inOut",
            },
            2.5,
          )
          .to(backdrop, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, 2.9);
      } else {
        tl.to(cards, { opacity: 0, duration: 0.6, stagger: { each: 0.08, from: "end" } }, 2.5).to(backdrop, { autoAlpha: 0, duration: 0.6 }, 2.9);
      }

      return () => {
        document.documentElement.removeAttribute(LOCK);
        first.revert();
        trail.revert();
        note.revert();
      };
    },
    { scope: rootRef, dependencies: [active] },
  );

  return (
    <div ref={rootRef} aria-hidden {...props} className="pointer-events-none fixed inset-0 z-150 overflow-hidden">
      <ServerInlineScript id="raven-loader-lock" html={LOCK_EARLY} />
      <div ref={backdropRef} className="absolute inset-0 bg-(--raven-paper)" />

      <div className="font-raven-head absolute inset-0 flex items-center justify-between px-[5vw] text-40 font-medium text-raven-ink max-lg:px-[6vw] max-lg:text-[4vw] max-md:flex-col max-md:justify-center max-md:gap-[52vh] max-md:px-[7vw] max-md:text-[7vw]">
        <p ref={leadingRef} className={TEXT_ENTRY}>
          {leading}
        </p>
        <p ref={trailingRef} className={TEXT_ENTRY}>
          {trailing}
        </p>
      </div>

      {images.map((image, index) => (
        <div
          key={index}
          data-stack-loader-card
          className={`absolute inset-0 m-auto h-[7vw] w-[7vw] overflow-hidden rounded-sm motion-reduce:animate-none max-lg:h-[12vw] max-lg:w-[12vw] max-md:h-[17vw] max-md:w-[17vw] ${CARD_ENTRY[index % CARD_ENTRY.length]}`}
        >
          <Image src={image.src} alt={image.alt} fill priority sizes={sizes} quality={quality} className="h-full w-full object-cover" />
        </div>
      ))}

      <p
        ref={captionRef}
        className={`absolute bottom-[3vw] left-0 w-full px-[5vw] text-center text-22 text-raven-muted max-lg:bottom-[5vw] max-lg:text-[2.4vw] max-md:bottom-[8vw] max-md:text-[3.8vw] ${TEXT_ENTRY}`}
      >
        {caption}
      </p>
    </div>
  );
};

export default StackLoader;
