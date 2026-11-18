
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { FadeUp, LineReveal, MaskReveal } from "../Animations/gsapAnim";
import { PAGE_DELAY } from "../Animations/timing";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import { ArrowRight } from "../Buttons/icons";
import Breadcrumb from "../shared/Breadcrumb";
import { ROUTES } from "../../routes";
import { PROJECTS } from "./projects";
import WorkGrid, { categories } from "./WorkGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pad = (value: number) => String(value).padStart(2, "0");


type View = "grid" | "full";

// The projects page: a title, then the work either as a filterable two-column grid or as a
// full-screen slider that moves one project at a time as the page scrolls
const WorkIndex = () => {
  const [view, setView] = useState<View>("grid");
  const lenis = useLenis();
  const listRef = useRef<HTMLDivElement | null>(null);

  const choose = (next: View) => {
    if (next === view) return;
    setView(next);
    // Start the new view from its top, just under the title
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) {
      const top = list.getBoundingClientRect().top + window.scrollY - 120;
      if (lenis) lenis.scrollTo(top, { immediate: true });
      else window.scrollTo(0, top);
    }
  };

  // Each view has its own scroll triggers and heights, so measure again after a switch
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => window.clearTimeout(id);
  }, [view]);

  return (
    <>
      <section className="flex flex-col gap-11 max-lg:gap-6 max-md:gap-8 px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[25%]">
        <Breadcrumb crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Work" }]} />
        <div className="flex items-end justify-between gap-8 max-md:flex-col max-md:items-start">
          <div className="flex flex-col gap-6 max-lg:gap-3 max-md:gap-5">
            <div className="flex items-start gap-3 max-lg:gap-2 max-md:gap-1">
              <MaskReveal as="h1" delay={PAGE_DELAY} className="raven-display">
                Selected <span className="raven-accent">Work</span>
              </MaskReveal>
              <FadeUp delay={PAGE_DELAY + 0.3} as="span" className="font-raven-head text-30 font-medium tabular-nums">
                ({pad(PROJECTS.length)})
              </FadeUp>
            </div>
            <LineReveal delay={PAGE_DELAY + 0.4} className="w-[34vw] text-22 leading-[1.5] text-raven-muted max-lg:w-[60vw] max-md:w-full">
              Identities, websites, motion and packaging for brands that wanted to be remembered. Open any project for the full story.
            </LineReveal>
          </div>

          <FadeUp delay={PAGE_DELAY + 0.5} className="flex gap-1 rounded-full bg-(--raven-ink)/6 p-1" role="group" aria-label="Choose a view">
            {(["grid", "full"] as View[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => choose(option)}
                className={`font-raven-head flex h-[4.4vh] items-center gap-2 rounded-full px-[0.9vw] text-22 font-medium transition-colors duration-300 max-lg:h-[3.4vh] max-lg:px-[1.8vw] max-md:h-[4.4vh] max-md:px-[3vw] ${
                  view === option ? "bg-(--raven-ink) text-(color:--raven-paper)" : "text-(color:--raven-ink) hover:bg-(--raven-ink)/8"
                }`}
              >
                <span aria-hidden className={`grid size-[0.9vw] gap-0.5 max-lg:size-[2vw] max-md:size-[3.4vw] ${option === "grid" ? "grid-cols-2" : ""}`}>
                  {Array.from({ length: option === "grid" ? 4 : 1 }, (_, index) => (
                    <span key={index} className="rounded-xs bg-current" />
                  ))}
                </span>
                {option === "grid" ? "Grid" : "Full"}
              </button>
            ))}
          </FadeUp>
        </div>
      </section>

      <div ref={listRef}>{view === "grid" ? <WorkGrid /> : <WorkSlider />}</div>
    </>
  );
};

// Clip shapes, as inset(top right bottom left)
const OPEN = "inset(0% 0% 0% 0%)";
const SHUT_BELOW = "inset(100% 0% 0% 0%)";
const SHUT_BOTTOM_RIGHT = "inset(100% 0% 0% 100%)";

// One project per screen. The section is as tall as one screen per project and its stage
// stays put while the page scrolls through it. Each change is tied to the scroll: the next
// project wipes up over the last, its framed picture grows from the bottom-right corner and
// its words rise into place, so a fast scroll plays every step quickly and scrolling back
// runs it in reverse.
const WorkSlider = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const count = PROJECTS.length;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", section);
      const follow = (progress: number) => setActive(Math.round(progress * (count - 1)));

      if (prefersReducedMotion()) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            follow(self.progress);
            const current = Math.round(self.progress * (count - 1));
            slides.forEach((slide, index) => gsap.set(slide, { clipPath: index <= current ? OPEN : SHUT_BELOW }));
          },
        });
        return;
      }

      // One unit of the timeline is one screen of scroll; each project takes most of its screen
      // to arrive and then holds still for a moment before the next
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true, onUpdate: (self) => follow(self.progress) },
      });
      slides.forEach((slide, index) => {
        if (index === 0) return;
        const at = index - 1 + 0.1;
        timeline
          .fromTo(slide, { clipPath: SHUT_BELOW }, { clipPath: OPEN, duration: 0.6, ease: "power2.inOut" }, at)
          .fromTo(slide.querySelector("[data-slide-bg]"), { scale: 1.4 }, { scale: 1.1, duration: 0.9, ease: "power1.out" }, at)
          .fromTo(slide.querySelector("[data-slide-frame]"), { clipPath: SHUT_BOTTOM_RIGHT }, { clipPath: OPEN, duration: 0.5, ease: "power2.inOut" }, at + 0.2)
          .fromTo(
            slide.querySelector("[data-slide-zoom]"),
            { scale: 1.5, transformOrigin: "100% 100%" },
            { scale: 1, duration: 0.6, ease: "power2.out" },
            at + 0.2,
          )
          .fromTo(slide.querySelectorAll("[data-slide-text]"), { yPercent: 110 }, { yPercent: 0, duration: 0.3, ease: "power2.out", stagger: { amount: 0.1 } }, at + 0.5);
      });
      // Keep the timeline exactly one unit per screen, so scroll and slides line up
      timeline.set({}, {}, count - 1);
    },
    { scope: sectionRef },
  );

  // The buttons scroll the page to the next or previous project's screen
  const go = (step: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const index = Math.max(0, Math.min(count - 1, active + step));
    const top = section.getBoundingClientRect().top + window.scrollY + index * window.innerHeight + 2;
    if (lenis) lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} aria-label="Projects, one at a time" className="relative" style={{ height: `${count * 100}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-(--raven-ink)">
        {PROJECTS.map((project, index) => (
          <div
            key={project.title}
            data-slide
            aria-hidden={index !== active}
            className={`absolute inset-0 text-(color:--raven-paper) ${index === 0 ? "[clip-path:inset(0%_0%_0%_0%)]" : "[clip-path:inset(100%_0%_0%_0%)]"}`}
          >
            <div data-slide-bg className="absolute inset-0 [transform:scale(1.1)]">
              <Image src={project.image} alt={project.alt} fill sizes="100vw" quality={70} className="object-cover blur-[0.2vh]" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-(--raven-ink)/60" />

            <div className="relative grid h-full grid-cols-[1fr_auto_1fr] items-center gap-11 max-lg:gap-6 max-md:gap-3 px-[5vw] max-lg:px-[6vw] max-md:grid-cols-2 max-md:content-center max-md:gap-y-5 max-md:px-[7vw]">
              <span className="overflow-hidden max-md:order-1">
                <span data-slide-text className="font-raven-head block text-40 font-medium tabular-nums">
                  {project.year}
                </span>
              </span>

              <div className="group flex flex-col items-start gap-4 max-lg:gap-2 max-md:gap-3 max-md:order-3 max-md:col-span-2">
                <span data-slide-frame className="relative block aspect-4/3 w-[36vw] overflow-hidden max-lg:w-[56vw] max-md:w-full">
                  <span data-slide-zoom className="absolute inset-0">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 70vw, 45vw"
                      quality={90}
                      className="object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
                    />
                  </span>
                  {/* Corner marks, like a crop on a contact sheet */}
                  {["left-[0.8vw] top-[0.8vw] border-l border-t", "right-[0.8vw] top-[0.8vw] border-r border-t", "bottom-[0.8vw] left-[0.8vw] border-b border-l", "bottom-[0.8vw] right-[0.8vw] border-b border-r"].map((corner) => (
                    <span key={corner} aria-hidden className={`absolute size-[0.9vw] border-(--raven-paper) max-lg:size-3 ${corner}`} />
                  ))}
                </span>
                <span className="flex w-full items-baseline justify-between gap-4 overflow-hidden">
                  <span data-slide-text className="font-raven-head block text-24 font-semibold">
                    {project.title}
                  </span>
                  <span data-slide-text className="flex items-center gap-2 text-14 text-(color:--raven-paper)/70">
                    Selected project
                  </span>
                </span>
              </div>

              <span className="overflow-hidden text-right max-md:order-2">
                <span data-slide-text className="font-raven-head block text-40 font-medium">
                  {categories(project)}
                </span>
              </span>
            </div>
          </div>
        ))}

        {/* Where you are, and buttons to step through */}
        <div className="absolute inset-x-0 bottom-[2vw] z-[100] flex items-center justify-between px-[5vw] text-(color:--raven-paper) max-lg:px-[6vw] max-md:bottom-6 max-md:px-[7vw]">
          <FadeUp as="span" className="font-raven-head text-22 font-medium tabular-nums" aria-live="polite">
            {pad(active + 1)} <span className="text-(color:--raven-paper)/50">/ {pad(count)}</span>
          </FadeUp>
          <FadeUp as="span" className="flex gap-2">
            {[
              { step: -1, label: "Previous project", className: "rotate-180" },
              { step: 1, label: "Next project", className: "" },
            ].map((button) => (
              <button
                key={button.label}
                type="button"
                aria-label={button.label}
                disabled={button.step < 0 ? active === 0 : active === count - 1}
                onClick={() => go(button.step)}
                className="flex aspect-square h-[5.4vh] items-center justify-center rounded-full border border-(--raven-paper)/30 transition-colors duration-300 hover:border-(--raven-paper) hover:bg-(--raven-paper) hover:text-(color:--raven-ink) disabled:pointer-events-none disabled:opacity-30 max-lg:h-[4.1vh] max-md:h-[5.7vh]"
              >
                <ArrowRight className={`size-[1vw] max-lg:size-4 ${button.className}`} />
              </button>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default WorkIndex;
