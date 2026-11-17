
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { LineReveal } from "../Animations/gsapAnim";
import { INTRO_DELAY } from "../Animations/timing";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import { BRAND } from "../../brand";
import { ROUTES } from "../../routes";
import BrandMark from "../shared/BrandMark";
import { STACK_LOADER_HANDOFF, stackLoaderLead, stackLoaderPlaying } from "../effects/stack-loader";
import { HERO_CARDS as CARDS, HERO_CARD_SIZES } from "./heroCards";

gsap.registerPlugin(useGSAP, SplitText);

// A fanned stack of project photos: the top card is index 0. Each resting slot has its own
// tilt and offset, so the pile reads as cards dropped on a desk.
const SLOTS = [
  { rotation: 0, x: 0, y: 0 },
  { rotation: -6, x: -2.2, y: -1.2 },
  { rotation: 5, x: 2.4, y: -2 },
  { rotation: -2, x: 0.6, y: -3.2 },
];
const CYCLE_MS = 3200;

const Hero = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const wordmarkBoxRef = useRef<HTMLDivElement | null>(null);
  const orderRef = useRef(CARDS.map((_, index) => index));
  const fannedRef = useRef(false);
  const [withLoader] = useState(() => stackLoaderPlaying(ROUTES.home));
  const [handoff] = useState(() => (withLoader ? stackLoaderLead() + STACK_LOADER_HANDOFF : 0));
  const start = withLoader ? handoff - 0.5 : INTRO_DELAY;

  useGSAP(
    () => {
      const hero = heroRef.current;
      const box = wordmarkBoxRef.current;
      const wordmark = box?.querySelector<HTMLElement>("[data-hero-wordmark]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-hero-card]", hero);
      if (!hero || !box || !wordmark) return;

      // The wordmark is sized so the studio name spans the full width. The ® glyph draws a
      // little past its advance width, so the fit leaves 3% spare or it gets clipped.
      const fit = () => {
        wordmark.style.fontSize = "100px";
        const natural = wordmark.getBoundingClientRect().width || 1;
        wordmark.style.fontSize = `${(97 * box.clientWidth) / natural}px`;
      };
      fit();
      document.fonts?.ready.then(fit);
      window.addEventListener("resize", fit);

      // Every card goes to the slot that matches its place in the pile
      const place = (duration: number) => {
        const vw = window.innerWidth / 100;
        const spread = fannedRef.current ? 1.8 : 1;
        orderRef.current.forEach((cardIndex, slot) => {
          const rest = SLOTS[slot];
          gsap.to(cards[cardIndex], {
            rotation: rest.rotation * spread,
            x: rest.x * vw * spread,
            y: rest.y * vw * spread,
            zIndex: CARDS.length - slot,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
        });
      };

      if (prefersReducedMotion()) {
        place(0);
        return () => window.removeEventListener("resize", fit);
      }

      // Entrance: the name rises letter by letter, the cards are dealt in from below
      const text = wordmark.querySelector<HTMLElement>("[data-hero-wordmark-text]");
      if (text) {
        const split = SplitText.create(text, { type: "chars", mask: "chars", aria: "none" });
        // Each letter rises inside its own clip box. Glyphs like ® draw past their advance
        // width, so the boxes get room on both sides (cancelled by negative margins so the
        // spacing doesn't change), and they stop clipping once the letters land. Reverting the
        // split instead would shift the line's baseline and make the whole word jump.
        gsap.set(split.masks, { paddingInline: "0.12em", marginInline: "-0.12em" });
        fit();
        gsap.from(split.chars, {
          yPercent: 105,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.04,
          delay: start + 0.1,
          onComplete: () => gsap.set(split.masks, { overflow: "visible" }),
        });
      }
      gsap.from(hero.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, y: 16, duration: 1, ease: "power3.out", stagger: 0.1, delay: start + 0.5 });
      place(0);
      // With the loader playing, the cards stay as they are: the loader's opaque backdrop
      // covers them, and the loader hides them itself just before that backdrop fades, then
      // shows them again as its own photos land on them
      if (!withLoader) {
        orderRef.current.forEach((cardIndex, slot) => {
          gsap.from(cards[cardIndex], {
            y: window.innerHeight,
            rotation: 14,
            duration: 1.4,
            ease: "expo.out",
            delay: INTRO_DELAY + 0.3 + (CARDS.length - slot) * 0.09,
          });
        });
      }

      // Every few seconds the top card drops behind the pile
      const cycle = () => {
        const [top, ...rest] = orderRef.current;
        gsap
          .timeline()
          .to(cards[top], { y: `+=${window.innerHeight * 0.08}`, rotation: 9, duration: 0.35, ease: "power2.in" })
          .add(() => {
            orderRef.current = [...rest, top];
            place(0.9);
          });
      };
      let timer: number | undefined;
      const begin = window.setTimeout(() => {
        timer = window.setInterval(cycle, CYCLE_MS);
      }, handoff * 1000);

      // Hovering the pile fans it out
      const stack = hero.querySelector<HTMLElement>("[data-hero-stack]");
      const onEnter = () => {
        fannedRef.current = true;
        place(0.7);
      };
      const onLeave = () => {
        fannedRef.current = false;
        place(0.7);
      };
      stack?.addEventListener("pointerenter", onEnter);
      stack?.addEventListener("pointerleave", onLeave);

      return () => {
        window.clearTimeout(begin);
        window.clearInterval(timer);
        window.removeEventListener("resize", fit);
        stack?.removeEventListener("pointerenter", onEnter);
        stack?.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      id="top"
      aria-label={`${BRAND.name}, brand and digital studio`}
      className="relative flex h-svh min-h-[40rem] flex-col justify-between overflow-hidden bg-(--raven-paper) px-[5vw] pb-[1vw] pt-[7rem] text-(color:--raven-ink) max-lg:px-[6vw] max-md:px-[7vw] max-md:pb-[3vw] max-md:pt-[6rem]"
    >
      <LineReveal
        delay={start + 0.5}
        className="font-raven-head relative z-20 w-[24vw] text-22 font-medium leading-[1.35] max-lg:w-[50vw] max-md:w-full max-md:text-[4.4vw]! md:max-lg:landscape:w-[30vw] md:max-lg:landscape:text-[1.7vw]!"
      >
        <b className="font-bold">
          <BrandMark />
        </b> is a brand and digital studio shaping identities, products and campaigns
        for ambitious teams in {BRAND.cities}.
      </LineReveal>

      {/* The fanned stack, centred over the wordmark */}
      <Link
        href={ROUTES.work}
        data-hero-stack
        data-cursor="See work"
        aria-label="See the work"
        draggable={false}
        // Phones: the stack joins the page flow between the intro and the © line, sized by the
        // screen height, so it never rides up over the intro on shorter phones. Landscape
        // tablets keep the desktop arrangement (narrow intro on the left) and size the stack by
        // the screen height too, so a short screen can't push it over the intro or the name.
        className="absolute left-1/2 top-[52%] z-10 block aspect-4/5 select-none [-webkit-user-drag:none] w-[24vw] -translate-x-1/2 -translate-y-1/2 max-lg:w-[40vw] md:max-lg:landscape:w-[min(40vw,32svh)] max-md:relative max-md:left-auto max-md:top-auto max-md:mx-auto max-md:mt-8 max-md:mb-[25vw] max-md:w-[min(54vw,26svh)] max-md:translate-x-0 max-md:translate-y-0"
      >
        {CARDS.map((card, index) => (
          <span
            key={card.alt}
            data-hero-card
            className="absolute inset-0 overflow-hidden rounded-lg max-lg:rounded-sm max-md:rounded-lg shadow-[0_2vw_4vw_-1vw_rgb(10_10_10/0.35)]"
            style={{ zIndex: CARDS.length - index }}
          >
            <Image
              src={card.image}
              alt={card.alt}
              fill
              priority={index === 0}
              // Landscape photos (up to 16:9) cover a 4:5 card, so they're drawn over twice its width
              sizes={HERO_CARD_SIZES}
              quality={90}
              draggable={false}
              className="pointer-events-none select-none object-cover"
            />
          </span>
        ))}
      </Link>

      <div className="relative">
        <div data-hero-fade className="font-raven-head absolute bottom-full right-0 z-20 flex flex-col items-end gap-1 pb-[1.5vw] text-right max-md:pb-4">
          <span className="text-30 font-bold leading-none max-md:text-[5vw]!">© 2018–26</span>
        </div>
        {/* The CSS size is the one fit() arrives at (0.282259 x the box width, for this name in
            this face), so the server HTML is already the right height and nothing jumps when the
            script takes over. fit() still sets the exact size. */}
        <div ref={wordmarkBoxRef} aria-hidden className="w-full [container-type:inline-size]">
          <span data-hero-wordmark className="font-raven-head inline-block whitespace-nowrap font-bold leading-[0.78] tracking-[-0.055em] [font-size:calc(100cqw*0.282259)]">
            <span data-hero-wordmark-text>
              <BrandMark />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
