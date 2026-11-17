
"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeUp, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import ClipReveal from "../effects/clip-reveal";
import { PROJECTS, type Project } from "./projects";

gsap.registerPlugin(ScrollTrigger);

export const CATEGORY_NAMES: Record<string, string> = {
  branding: "Branding",
  web: "Web",
  motion: "Motion",
  packaging: "Packaging",
};
const FILTERS = ["all", ...Object.keys(CATEGORY_NAMES)];
export const categories = (project: Project) => project.cats.map((cat) => CATEGORY_NAMES[cat] ?? cat).join(", ");

// Two columns of projects, with filters for the kind of work
type WorkGridProps = {
  // Optional heading row above the filters (the homepage uses it; the Work page has its own hero)
  heading?: ReactNode;
  // Optional link at the end of the heading row
  action?: ReactNode;
  // Show only the first few projects (the homepage shows four)
  limit?: number;
  // The category filters; the homepage turns them off
  filters?: boolean;
};

const WorkGrid = ({ heading, action, limit, filters = true }: WorkGridProps) => {
  const [filter, setFilter] = useState("all");
  const listRef = useRef<HTMLUListElement | null>(null);
  const shown = useMemo(() => {
    const matching = filter === "all" ? PROJECTS : PROJECTS.filter((project) => project.cats.includes(filter));
    return limit ? matching.slice(0, limit) : matching;
  }, [filter, limit]);
  const firstRender = useRef(true);

  // A new filter fades the remaining projects back in, one after another
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const items = listRef.current?.querySelectorAll("li");
    if (!items || prefersReducedMotion()) return;
    const tween = gsap.fromTo(items, { autoAlpha: 0, y: "4.4vh" }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1 });
    ScrollTrigger.refresh();
    return () => {
      tween.kill();
    };
  }, [filter]);

  return (
    <section id="work" aria-label="Projects" className="flex flex-col gap-9 max-lg:gap-8 px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[15%]">
      {(heading || action) && (
        <div className="flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          {heading}
          {action}
        </div>
      )}
      <div className="flex flex-col gap-11 max-lg:gap-6 max-md:gap-8">
        <div className="flex flex-col gap-5 max-lg:gap-3 max-md:gap-5">
          <RuleDraw className="h-px w-full bg-(--raven-ink)/15" />
          {filters && (
            <FadeUp role="group" aria-label="Filter projects" className="flex flex-wrap gap-x-6 max-lg:gap-x-3 max-md:gap-x-5 gap-y-2">
              {FILTERS.map((option) => {
                const count = option === "all" ? PROJECTS.length : PROJECTS.filter((project) => project.cats.includes(option)).length;
                const active = filter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(option)}
                    className={`font-raven-head flex items-start gap-1 text-22 font-medium transition-colors duration-300 ${
                      active ? "text-(color:--raven-ink)" : "text-(color:--raven-muted) hover:text-(color:--raven-ink)"
                    }`}
                  >
                    <span className={active ? "underline decoration-1 underline-offset-[0.3vw] max-lg:underline-offset-[0.8vw] max-md:underline-offset-[1.3vw]" : ""}>{option === "all" ? "All" : CATEGORY_NAMES[option]}</span>
                    <span className="text-14 tabular-nums">{count}</span>
                  </button>
                );
              })}
            </FadeUp>
          )}
        </div>

        <ul ref={listRef} className="grid grid-cols-2 gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 gap-y-18 max-lg:gap-y-10 max-md:gap-y-12 max-md:grid-cols-1">
          {shown.map((project, index) => (
            <li key={project.title}>
              <div className="group flex flex-col gap-4 max-lg:gap-2 max-md:gap-3">
                <FadeUp delay={(index % 2) * 0.1} className="flex justify-between gap-4 text-14 text-raven-muted">
                  <span className="tabular-nums">{project.year}</span>
                  <span>{categories(project)}</span>
                </FadeUp>
                <ClipReveal delay={(index % 2) * 0.1} className="aspect-4/3 rounded-lg max-lg:rounded-sm max-md:rounded-lg">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 767px) 120vw, 60vw"
                    quality={90}
                    className="object-cover transition-[scale] duration-[1.2s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
                  />
                </ClipReveal>
                <div className="flex items-baseline justify-between gap-4">
                  <MaskReveal as="h3" delay={(index % 2) * 0.1} className="text-30 font-semibold tracking-tight">
                    {project.title}
                  </MaskReveal>
                  <FadeUp as="span" delay={(index % 2) * 0.1 + 0.1} className="flex items-center gap-2 text-22 text-raven-muted">
                    {project.meta}
                  </FadeUp>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WorkGrid;
