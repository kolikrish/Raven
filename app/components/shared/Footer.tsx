
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Dribbble, Instagram } from "lucide-react";
import { LinkedinIn } from "../Buttons/icons";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import DriftingLight from "../effects/drifting-light";
import FooterParallax from "../effects/parallax-footer";
import VariableTextProximity from "../effects/variable-text-proximity";
import { ROUTES } from "../../routes";
import { BRAND, STUDIOS, studioClock } from "../../brand";
import { titleCase } from "../../titleCase";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const COLUMNS = [
  {
    title: "Studio",
    links: [
      { label: "Work", href: ROUTES.work },
      { label: "Services", href: ROUTES.services },
      { label: "About", href: ROUTES.about },
      { label: "Journal", href: ROUTES.blog },
      { label: "Contact", href: ROUTES.contact },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: LinkedinIn },
  { label: "Dribbble", href: "https://dribbble.com/", Icon: Dribbble },
];

// A footer link whose label rolls up to a second copy of itself on hover
const RollLink = ({ href, label: text }: { href: string; label: string }) => {
  const label = titleCase(text);
  return (
    <Link
      href={href}
      className="group relative inline-flex overflow-hidden leading-[1.3] text-(color:--raven-white)/75 transition-colors duration-300 hover:text-(color:--raven-white)"
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:-translate-y-full motion-reduce:transition-none">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-full block text-(color:--raven-white) transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:-translate-y-full motion-reduce:transition-none"
      >
        {label}
      </span>
    </Link>
  );
};

const ColumnTitle = ({ children }: { children: string }) => (
  <h3 data-footer-title className="opacity-0 font-raven-head text-22 font-medium text-(color:--raven-white)">
    {children}
  </h3>
);

// The same reveals as the rest of the site (MaskReveal, LineReveal, FadeUp, RuleDraw), but keyed
// to the footer's wrapper scrolling up: the footer itself is fixed behind the page, so its
// pieces are always "on screen" and can't watch their own position.
const REVEAL_START = "25% bottom";
const FONT_WAIT_CAP = 800;

const whenFontsReady = (callback: () => void) => {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    callback();
  };
  const timer = window.setTimeout(run, FONT_WAIT_CAP);
  if (document.fonts) document.fonts.ready.then(run, run);
  else run();
  return () => {
    done = true;
    window.clearTimeout(timer);
  };
};

// The footer: the studio's name across the top, then about, links and contact in columns,
// all on a dark panel with a beam of light drifting through it
const Footer = () => {
  const markRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [clocks, setClocks] = useState(() => STUDIOS.map(() => ({ time: "", open: false })));

  useEffect(() => {
    const tick = () => setClocks(STUDIOS.map((studio) => studioClock(studio)));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  // The footer lives in the layout, so it stays mounted from page to page, but its
  // scroll trigger was measured against the first page's height. Re-measure whenever
  // the page content changes height (a new page, images arriving late).
  useEffect(() => {
    const main = document.querySelector(".raven-page > main");
    if (!main) return;

    let timer = 0;
    let lastHeight = main.getBoundingClientRect().height;
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      if (Math.abs(height - lastHeight) < 1) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(main);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // The wordmark's letters rise into place as the footer scrolls up
  useGSAP(
    () => {
      const mark = markRef.current;
      const wrapper = document.getElementById("footer");
      if (!mark || !wrapper || prefersReducedMotion()) return;

      gsap.fromTo(
        mark.querySelectorAll("[data-proximity-letter]"),
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: wrapper, start: "10% bottom", end: "60% bottom", scrub: true },
        },
      );
    },
    { scope: markRef },
  );

  // Column titles wipe in, the about copy rises line by line, icons and links fade up in
  // turn and the bottom rule draws across, once, as the footer comes into view
  useGSAP(
    (_context, contextSafe) => {
      const panel = panelRef.current;
      const wrapper = document.getElementById("footer");
      if (!panel || !wrapper || !contextSafe) return;

      const titles = gsap.utils.toArray<HTMLElement>("[data-footer-title]", panel);
      const copy = gsap.utils.toArray<HTMLElement>("[data-footer-copy]", panel);
      const items = gsap.utils.toArray<HTMLElement>("[data-footer-item]", panel);
      const rules = gsap.utils.toArray<HTMLElement>("[data-footer-rule]", panel);

      if (prefersReducedMotion()) {
        gsap.set([...titles, ...copy, ...items], { opacity: 1 });
        gsap.set(rules, { scaleX: 1 });
        return;
      }

      gsap.set(items, { y: 24 });

      const splits: SplitText[] = [];
      let stopWaiting = () => {};

      const play = contextSafe(() => {
        const titleLines = titles.flatMap((el) => {
          const split = SplitText.create(el, { type: "lines", linesClass: "raven-mask-line", aria: "none" });
          splits.push(split);
          return split.lines as HTMLElement[];
        });
        const copyLines = copy.flatMap((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines", aria: "none" });
          splits.push(split);
          return split.lines as HTMLElement[];
        });

        gsap.set([...titles, ...copy], { opacity: 1 });
        gsap.set(titleLines, { maskPosition: "100% 100%", webkitMaskPosition: "100% 100%" });
        gsap.set(copyLines, { yPercent: 110 });

        gsap.fromTo(rules, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 0.8, ease: "power2.out" });
        gsap.to(titleLines, {
          maskPosition: "0% 100%",
          webkitMaskPosition: "0% 100%",
          duration: 3.4,
          stagger: 0.2,
          ease: "power3.out",
          onComplete: () => {
            titleLines.forEach((line) => {
              line.classList.remove("raven-mask-line");
              line.style.removeProperty("mask-position");
              line.style.removeProperty("-webkit-mask-position");
            });
          },
        });
        gsap.to(copyLines, { yPercent: 0, duration: 1.2, stagger: 0.1, delay: 0.1, ease: "power3.out" });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.08,
          delay: 0.2,
          ease: "power3.out",
          onComplete: () => {
            items.forEach((item) => {
              item.style.removeProperty("opacity");
              item.classList.remove("opacity-0");
            });
          },
        });
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start: REVEAL_START,
        once: true,
        onEnter: () => {
          stopWaiting = whenFontsReady(play);
        },
      });

      return () => {
        stopWaiting();
        splits.forEach((split) => split.revert());
      };
    },
    { scope: panelRef },
  );

  return (
    <FooterParallax data-raven-inert data-cursor-quiet footerClassName="bg-(--raven-ink) text-(color:--raven-white)">
      <div ref={panelRef} className="relative flex min-h-screen flex-col justify-between gap-14 overflow-hidden px-[5vw] py-[3vh] max-lg:gap-16 max-lg:px-[6vw] max-md:gap-14 max-md:px-[7vw]">
        <DriftingLight className="absolute inset-0" />

        {/* The studio's name, edge to edge; its letters thicken under the pointer */}
        <div ref={markRef} className="relative select-none overflow-hidden">
          <VariableTextProximity
            label={BRAND.name}
            fromWeight={600}
            toWeight={850}
            // The CSS size is the one the fit arrives at (0.267351 x the box width, capped at
            // 0.34 / 0.75 of the screen height from 1024px), so the footer's columns don't
            // jump when the script takes over. The fit still sets the exact size.
            className="font-raven-head leading-[1.1] tracking-tight [container-type:inline-size]"
            hideUntilFit
            wordClassName="[font-size:min(calc(100cqw*0.267351),45.3333vh)] max-lg:[font-size:calc(100cqw*0.267351)]"
            letterClassName="text-(color:--raven-white)"
          />
        </div>

        <div className="relative grid grid-cols-12 gap-x-7 max-lg:gap-x-8 gap-y-12 max-lg:grid-cols-6 max-md:grid-cols-2 max-md:gap-y-10">
          <div className="col-span-4 flex flex-col items-start gap-4 max-lg:col-span-6 max-md:col-span-2">
            <ColumnTitle>About</ColumnTitle>
            <p data-footer-copy className="opacity-0 w-[85%] text-22 leading-[1.5] text-(color:--raven-white)/75 max-lg:w-[70%] max-md:w-full">
              {`A small brand and digital studio in ${BRAND.cities}. We write, design and build brands that are useful first and beautiful because of it.`}
            </p>
            <ul className="flex gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label} data-footer-item className="opacity-0">
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-[4.2vh] aspect-square items-center justify-center rounded-lg border border-(--raven-white)/25 text-(color:--raven-white)/85 transition-colors duration-300 hover:border-(--raven-white) hover:bg-(--raven-white) hover:text-(color:--raven-ink) max-lg:h-[3.7vh] max-md:h-[5.2vh]"
                  >
                    <Icon className="size-[42%]" strokeWidth={1.7} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="col-span-2 col-start-9 flex flex-col gap-4 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-2">
            {COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <ColumnTitle>{column.title}</ColumnTitle>
                <ul className="flex flex-col items-start gap-2 text-22">
                  {column.links.map((link) => (
                    <li key={link.label} data-footer-item className="opacity-0">
                      <RollLink href={link.href} label={link.label} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="col-span-2 col-start-11 flex flex-col gap-4 max-lg:col-span-3 max-md:col-span-2">
            <ColumnTitle>Contact</ColumnTitle>
            <ul className="flex flex-col items-start gap-2 text-22">
              <li data-footer-item className="opacity-0">
                <RollLink href={ROUTES.contact} label="Book a call" />
              </li>
              <li data-footer-item className="opacity-0">
                <a href={`mailto:${BRAND.email}`} className="text-(color:--raven-white)/75 transition-colors duration-300 hover:text-(color:--raven-white)">
                  {BRAND.email}
                </a>
              </li>
              {STUDIOS.map((studio, index) => (
                <li key={studio.city} data-footer-item className="opacity-0 flex items-center gap-2 tabular-nums text-(color:--raven-white)/75">
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-full ${clocks[index].open ? "bg-(--raven-accent-light)" : "border border-(--raven-white)/50"}`}
                  />
                  {studio.city} {clocks[index].time}
                  <span className="sr-only">{clocks[index].open ? ", open" : ", closed"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative grid grid-cols-3 items-center gap-4 py-[1.4vw] text-14 text-(color:--raven-white)/60 max-lg:py-[3vw] max-md:grid-cols-1 max-md:justify-items-start max-md:gap-3 max-md:py-[3vh]">
          <span
            data-footer-rule
            aria-hidden
            className="absolute inset-x-0 top-0 block h-px origin-left bg-(--raven-white)/15 [transform:scaleX(0)]"
          />
          <span data-footer-item className="opacity-0">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </span>
        </div>
      </div>
    </FooterParallax>
  );
};

export default Footer;
