
"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { FadeUp, LineReveal, MaskReveal, Odometer, RuleDraw } from "../Animations/gsapAnim";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import ParallaxImage from "../effects/parallax-image";
import grain from "../../assets/pictures/shared/grain.webp";
import seniorPhoto from "../../assets/pictures/about/belief-hands.webp";
import attentionPhoto from "../../assets/pictures/about/belief-focus.webp";
import resultsPhoto from "../../assets/pictures/about/belief-craft.webp";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Each belief has a photo; on desktop the photos wipe over one another as the beliefs scroll past
const VALUES = [
  {
    title: "Drawn Before It’s Designed",
    text: "Every idea starts as a pencil sketch on the long table in Oslo or Lisbon. If it can’t survive being drawn badly, it won’t survive being built well.",
    caption: "Pencil first, pixels second",
    image: seniorPhoto,
    alt: "A hand lettering on tracing paper with a mechanical pencil",
  },
  {
    title: "Dates That Hold",
    text: "We plan in two-week blocks and turn down work that would break them. You get a launch date in the first meeting, and it doesn’t move.",
    caption: "Two-week blocks, fixed launch dates",
    image: attentionPhoto,
    alt: "A small desk calendar standing on a black background",
  },
  {
    title: "Built to Be Handed Over",
    text: "We judge the work by how it behaves on an ordinary Monday, not how it looks in the case study. If your team can’t run it without us, it isn’t finished.",
    caption: "Finished means your team can run it",
    image: resultsPhoto,
    alt: "A hand drawing on a sheet of paper in low light",
  },
];

const STATS = [
  { value: "2018", label: "founded in Oslo" },
  { value: "2", label: "studios: Oslo and Lisbon" },
  { value: "22", label: "designers, writers and engineers" },
  { value: "9", label: "nationalities around the lunch table" },
];

// Desktop pins the photo and swaps it; smaller screens and reduced motion stack the beliefs
const PIN_QUERY = "(min-width: 1024px)";
const subscribePinned = (onChange: () => void) => {
  const query = window.matchMedia(PIN_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getPinned = () => window.matchMedia(PIN_QUERY).matches && !prefersReducedMotion();
const getServerPinned = () => false;

type Belief = { title: string; image: StaticImageData; alt: string };

// Clip shapes, as inset(top right bottom left): open, or shut into one corner
const PHOTO_OPEN = "inset(0% 0% 0% 0%)";
const PHOTO_TOP_LEFT = "inset(0% 100% 100% 0%)";
const PHOTO_BOTTOM_RIGHT = "inset(100% 0% 0% 100%)";

// The photos sit on top of one another, each later one above the last; all but the first
// start shut in the bottom-right corner, where they grow from as the beliefs scroll past
const BeliefPhotos = ({ items }: { items: Belief[] }) => (
  <div className="relative aspect-4/5 w-[min(100%,60vh)] overflow-hidden rounded-lg max-lg:rounded-sm max-md:rounded-xs">
    {items.map((item, index) => (
      <div
        key={item.title}
        data-belief-photo
        className={`absolute inset-0 overflow-hidden ${index === 0 ? "[clip-path:inset(0%_0%_0%_0%)]" : "[clip-path:inset(100%_0%_0%_100%)]"}`}
      >
        <div data-belief-zoom className="absolute inset-0">
          <Image src={item.image} alt={item.alt} fill sizes="(max-width: 1023px) 90vw, 40vw" quality={90} className="object-cover" />
        </div>
      </div>
    ))}
  </div>
);

const Stats = () => (
  <div className="flex flex-col gap-11 max-lg:gap-12 max-md:gap-6">
    <RuleDraw className="h-px w-full bg-(--raven-paper)/15" />
    <ul className="grid grid-cols-4 gap-x-9 gap-y-10 max-lg:grid-cols-2 max-md:gap-y-8">
      {STATS.map((item, index) => (
        <FadeUp as="li" key={item.label} delay={index * 0.1} className="flex flex-col gap-3">
          <Odometer value={item.value} className="font-raven-head text-64 leading-none" />
          <span className="w-[80%] text-14 text-(color:--raven-paper)/55 max-md:w-full">{item.label}</span>
        </FadeUp>
      ))}
    </ul>
  </div>
);

const PinnedBeliefs = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-belief-block]");
      const photos = gsap.utils.toArray<HTMLElement>("[data-belief-photo]");
      blocks.forEach((block, index) => {
        // The caption and dots follow whichever belief is crossing the middle of the screen
        ScrollTrigger.create({
          trigger: block,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setStep(index),
        });

        // The photo swap is tied to the scroll: as this belief rises toward the middle, its
        // photo grows out of the bottom-right corner, easing down from a zoom, while the last
        // one shrinks into the top left. A fast scroll plays it quickly; scrolling back reverses it.
        if (index > 0) {
          const incoming = photos[index];
          const outgoing = photos[index - 1];
          gsap
            .timeline({ scrollTrigger: { trigger: block, start: "top 85%", end: "top 40%", scrub: true } })
            .fromTo(incoming, { clipPath: PHOTO_BOTTOM_RIGHT }, { clipPath: PHOTO_OPEN, ease: "power2.inOut", immediateRender: false }, 0)
            .fromTo(
              incoming.querySelector("[data-belief-zoom]"),
              { scale: 1.5, transformOrigin: "100% 100%" },
              { scale: 1, ease: "power2.out", immediateRender: false },
              0,
            )
            .fromTo(outgoing, { clipPath: PHOTO_OPEN }, { clipPath: PHOTO_TOP_LEFT, ease: "power2.inOut", immediateRender: false }, 0)
            .fromTo(outgoing.querySelector("[data-belief-zoom]"), { scale: 1 }, { scale: 1.2, ease: "power2.in", immediateRender: false }, 0);
        }

        // Each block's title rises letter by letter and its paragraph line by line as it comes in
        const title = block.querySelector("h3");
        const body = block.querySelector("p");
        if (!title || !body) return;
        const titleSplit = SplitText.create(title, { type: "words,chars", mask: "words", aria: "none" });
        const bodySplit = SplitText.create(body, { type: "lines", mask: "lines", aria: "none" });
        gsap
          .timeline({ scrollTrigger: { trigger: block, start: "top 75%", toggleActions: "play none none reverse" } })
          .from(titleSplit.chars, { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: { amount: 0.4 } })
          .from(bodySplit.lines, { yPercent: 105, duration: 0.9, ease: "expo.out", stagger: 0.1 }, 0.2)
          .from(block.querySelectorAll("[data-belief-meta]"), { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 0.1);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} aria-label="What we believe" className="relative grid grid-cols-12 grid-rows-[auto_32vh] gap-x-9 px-[5vw]">
      <div className="col-span-5 flex flex-col gap-22">
        <MaskReveal as="h2">What We Believe</MaskReveal>
        <ol className="flex flex-col">
          {VALUES.map((item, index) => (
            <li
              key={item.title}
              data-belief-block
              className={`relative flex min-h-[60vh] flex-col justify-center gap-5 transition-opacity duration-700 ${
                index === step ? "opacity-100" : "opacity-30"
              }`}
            >
              <span data-belief-meta className="text-14 tabular-nums text-(color:--raven-paper)/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-64">{item.title}</h3>
              <p className="w-[90%] text-28 leading-[1.4] text-(color:--raven-paper)/65">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* The picture stays put while the beliefs scroll past it */}
      <div className="col-span-5 col-start-8 row-span-2">
        <figure className="sticky top-0 flex h-screen flex-col justify-center gap-4">
          <BeliefPhotos items={VALUES} />
          <figcaption className="flex items-center justify-between gap-6 text-14 text-(color:--raven-paper)/55">
            <span>{VALUES[step].caption}</span>
            <span aria-hidden className="flex gap-2">
              {VALUES.map((item, index) => (
                <span
                  key={item.title}
                  className={`size-[0.6vw] rounded-xs max-lg:rounded-none transition-colors duration-500 ${index === step ? "bg-(--raven-accent)" : "bg-(--raven-paper)/20"}`}
                />
              ))}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

const StackedBeliefs = () => (
  <section aria-label="What we believe" className="flex flex-col gap-14 px-[5vw] max-lg:gap-11 max-lg:px-[6vw] max-md:px-[7vw]">
    <MaskReveal as="h2">What We Believe</MaskReveal>
    <ol className="flex flex-col gap-36 max-lg:gap-21 max-md:gap-10">
      {VALUES.map((value, index) => (
        <li key={value.title} className="grid grid-cols-12 items-center gap-x-6 gap-y-8">
          <div className="col-span-7 flex flex-col gap-4 max-md:col-span-12">
            <FadeUp as="span" className="text-14 tabular-nums text-(color:--raven-paper)/55">
              {String(index + 1).padStart(2, "0")}
            </FadeUp>
            <MaskReveal as="h3" className="text-64">{value.title}</MaskReveal>
            <LineReveal className="text-28 leading-[1.4] text-(color:--raven-paper)/65">{value.text}</LineReveal>
          </div>
          <figure className="col-span-5 flex flex-col gap-3 max-md:col-span-12">
            <ParallaxImage reveal image={value.image} alt={value.alt} sizes="(max-width: 767px) 90vw, 40vw" className="aspect-4/5 rounded-4xl max-lg:rounded-2xl max-md:rounded-lg max-md:w-[80%]" />
            <FadeUp as="figcaption" className="text-14 text-(color:--raven-paper)/55">{value.caption}</FadeUp>
          </figure>
        </li>
      ))}
    </ol>
  </section>
);

const Beliefs = () => {
  const pinned = useSyncExternalStore(subscribePinned, getPinned, getServerPinned);

  return (
    // A dark band breaks up the light page; overflow-clip (not hidden) keeps the pinned part sticky
    <div className="px-[1.5vw] py-[4vw] max-md:px-[3vw]">
      <div className="relative flex flex-col gap-22 max-lg:gap-12 max-md:gap-6 overflow-clip rounded-4xl max-lg:rounded-2xl bg-(--raven-ink) py-[8%] text-(color:--raven-paper) max-lg:py-[12%] max-md:py-[15%]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1 opacity-12 mix-blend-overlay"
          style={{ backgroundImage: `url(${grain.src})` }}
        />
        {pinned ? <PinnedBeliefs /> : <StackedBeliefs />}
        <div className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw]">
          <Stats />
        </div>
      </div>
    </div>
  );
};

export default Beliefs;
