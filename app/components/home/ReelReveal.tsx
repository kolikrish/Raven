
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import AutoVideo from "./AutoVideo";
import Button from "../Buttons/Button";
import { ROUTES } from "../../routes";
import reelPoster from "../../assets/pictures/home/reel-studio-poster.webp";

const reelVideo = new URL("../../assets/video/reel-studio.mp4", import.meta.url).toString();
const reelCaptions = new URL("../../assets/video/reel-studio.vtt", import.meta.url).toString();

gsap.registerPlugin(useGSAP, ScrollTrigger);

// A headline with the showreel tucked into it as a small rounded clip. Scrolling grows the
// clip out of the line until it fills the screen, while the words part around it; then a
// caption fades in over the film. The whole move is scrubbed, so it follows the scroll exactly.
const ReelReveal = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slotRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const slot = slotRef.current;
      const media = mediaRef.current;
      const caption = captionRef.current;
      if (!section || !stage || !slot || !media || !caption) return;

      const lines = gsap.utils.toArray<HTMLElement>("[data-reel-line]", stage);

      // Where the slot sits inside the stage, so the clip starts exactly over it
      const box = () => {
        const s = stage.getBoundingClientRect();
        const r = slot.getBoundingClientRect();
        return { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height };
      };

      if (prefersReducedMotion()) {
        // No growth: the clip just plays in its slot and the caption sits under the headline
        const place = () => gsap.set(media, { ...box(), borderRadius: 999 });
        place();
        window.addEventListener("resize", place);
        return () => window.removeEventListener("resize", place);
      }

      gsap.set(caption, { autoAlpha: 0, y: 24 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          media,
          { left: () => box().left, top: () => box().top, width: () => box().width, height: () => box().height, borderRadius: () => box().height / 2 },
          { left: 0, top: 0, width: () => stage.clientWidth, height: () => stage.clientHeight, borderRadius: 0, duration: 1, ease: "power2.inOut" },
          0,
        )
        .to(lines[0], { yPercent: -120, autoAlpha: 0, duration: 0.6 }, 0.05)
        .to(lines[1], { yPercent: 120, autoAlpha: 0, duration: 0.6 }, 0.05)
        .to(caption, { autoAlpha: 1, y: 0, duration: 0.3 }, 1)
        .to({}, { duration: 0.25 });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} aria-label="Studio reel" className="relative h-[300vh] motion-reduce:h-auto">
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden motion-reduce:relative motion-reduce:h-[80vh]">
        <h2 className="font-raven-head absolute inset-0 flex flex-col items-center justify-center gap-2 max-lg:gap-1 max-md:gap-0.5 px-[5vw] text-center text-[7.4vw]! leading-[0.95] max-lg:text-[10vw]! max-md:px-[7vw] max-md:text-[13vw]!">
          <span data-reel-line className="block">
            We Make Brands{" "}
            <span ref={slotRef} aria-hidden className="inline-block h-[0.78em] w-[1.9em] align-[-0.06em]" />
          </span>
          <span data-reel-line className="block">
            People <span className="raven-accent">Stop For.</span>
          </span>
        </h2>

        {/* The clip itself: positioned over the slot, then grown to the full stage */}
        <div ref={mediaRef} className="absolute left-0 top-0 overflow-hidden bg-(--raven-ink) will-change-[width,height]">
          <AutoVideo src={reelVideo} poster={reelPoster.src} captions={reelCaptions} label="Studio reel: a designer pins drawings to the studio wall" />
        </div>

        <div
          ref={captionRef}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-[linear-gradient(to_top,rgb(10_10_10/0.75),rgb(10_10_10/0.35)_55%,transparent)] px-[5vw] pb-[3vw] pt-[12vw] text-(color:--raven-white) max-lg:flex-col max-lg:items-start max-lg:px-[6vw] max-lg:pb-[5vw] max-md:px-[7vw] max-md:pb-[8vw] motion-reduce:hidden"
        >
          <p className="font-raven-head w-[34%] text-40 leading-[1.15] tracking-tight max-lg:w-[80%] max-md:w-full">
            Eight years, two cities, one rule: if it doesn’t make someone stop, we start again.
          </p>
          <Button label="See the work" href={ROUTES.work} tone="media" size="sm" icon />
        </div>
      </div>
    </section>
  );
};

export default ReelReveal;
