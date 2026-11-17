"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeUp, LineReveal, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import { prefersReducedMotion } from "../Animations/reducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WEEKS = 10;

// Each phase as a bar on a ten-week timeline: start and end are week numbers, inclusive
const PHASES = [
  {
    title: "Discover",
    start: 1,
    end: 2,
    time: "Weeks 1 to 2",
    text: "Interviews inside the company and out, plus an honest look at everything you already have.",
  },
  {
    title: "Define",
    start: 3,
    end: 4,
    time: "Weeks 3 to 4",
    text: "We agree what the brand stands for in a single line, and how it should sound saying it.",
  },
  {
    title: "Design and Build",
    start: 5,
    end: 9,
    time: "Weeks 5 to 9",
    text: "Directions sketched by hand and tried on the real things you make, then one built out in full.",
  },
  {
    title: "Launch and Grow",
    start: 10,
    end: 10,
    time: "Week 10 onward",
    text: "Files, training and a launch we run alongside you. After that, we’re one phone call away.",
  },
];

const Process = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Each bar grows from its start week as the timeline scrolls into view
      gsap.from("[data-phase-bar]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.18,
        scrollTrigger: { trigger: "[data-phase-chart]", start: "top 75%", toggleActions: "play none none reverse" },
      });
      gsap.from("[data-phase-label]", {
        autoAlpha: 0,
        x: -12,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.18,
        delay: 0.35,
        scrollTrigger: { trigger: "[data-phase-chart]", start: "top 75%", toggleActions: "play none none reverse" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="process" aria-label="How we work" className="px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[15%]">
      <div className="flex flex-col gap-4 pb-[5vw] max-md:pb-10">
        <MaskReveal as="h2" className="leading-[0.95]">
          How We <span className="raven-accent">Work</span>
        </MaskReveal>
        <LineReveal className="w-[32%] text-24 leading-[1.5] text-raven-muted max-lg:w-[60%] max-md:w-full">
          Four phases across roughly ten weeks. Each one closes with your yes before the next one opens.
        </LineReveal>
      </div>

      {/* The timeline: one column per week, one bar per phase */}
      <div data-phase-chart aria-hidden className="relative max-md:hidden">
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
          {Array.from({ length: WEEKS }, (_, week) => (
            <span key={week} className="relative">
              <RuleDraw vertical delay={week * 0.04} className="absolute inset-y-0 left-0 w-px bg-(--raven-ink)/10" />
              {week === WEEKS - 1 && <RuleDraw vertical delay={WEEKS * 0.04} className="absolute inset-y-0 right-0 w-px bg-(--raven-ink)/10" />}
            </span>
          ))}
        </div>
        <div className="relative flex flex-col gap-4 max-lg:gap-2 max-md:gap-1 py-[1.5vw]">
          {PHASES.map((phase) => (
            <div key={phase.title} className="grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
              <span
                data-phase-bar
                className="flex h-[3.4vw] items-center rounded-sm max-lg:rounded-xs bg-(--raven-ink) px-[1vw] text-(color:--raven-paper)"
                style={{ gridColumn: `${phase.start} / ${phase.end + 1}` }}
              >
                <span data-phase-label className="font-raven-head whitespace-nowrap text-22 font-medium">
                  {phase.title}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="grid pt-[0.8vw] text-14 tabular-nums text-raven-muted" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
          {Array.from({ length: WEEKS }, (_, week) => (
            <span key={week} className="pl-[0.5vw]">
              W{String(week + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>

      <ol className="grid grid-cols-4 gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 gap-y-10 pt-[4vw] max-lg:grid-cols-2 max-md:grid-cols-1 max-md:pt-0">
        {PHASES.map((phase, index) => (
          <li key={phase.title} className="relative flex flex-col gap-3 pt-[1.4vw] max-md:pt-5">
            <RuleDraw syncWithFade delay={index * 0.08} className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />
            <FadeUp as="span" delay={index * 0.08} className="text-14 tabular-nums text-raven-muted">
              {String(index + 1).padStart(2, "0")} / {phase.time}
            </FadeUp>
            <MaskReveal as="h3" delay={index * 0.08} className="text-30 font-semibold">
              {phase.title}
            </MaskReveal>
            <LineReveal delay={index * 0.08} className="text-22 leading-[1.45] text-raven-muted max-md:text-[3.8vw]!">
              {phase.text}
            </LineReveal>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Process;
