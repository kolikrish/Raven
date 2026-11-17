
"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import ClipNav from "../effects/immersive-full-screen-nav";
import UnderlineLink from "../Buttons/UnderlineLink";
import { ArrowUpRight } from "../Buttons/icons";
import { NAV_LINKS, ROUTES } from "../../routes";
import { BRAND, STUDIOS, studioClock } from "../../brand";

gsap.registerPlugin(useGSAP);

// The menu is for tablets and phones (desktop has the pill in the header): a blue panel
// drops from the top with the pages as large rows, then both studios with their local time.
const LINKS = [...NAV_LINKS, { label: "Contact", href: ROUTES.contact }];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Behance", href: "https://www.behance.net/" },
];

type MenuProps = {
  open: boolean;
  onClose: () => void;
  instant?: boolean;
};

const Menu = ({ open, onClose, instant = false }: MenuProps) => {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [clocks, setClocks] = useState(() => STUDIOS.map(() => ({ time: "", open: false })));

  // The custom cursor stays out of the blue panel (see Cursor.tsx)
  useEffect(() => {
    rootRef.current?.setAttribute("data-cursor-quiet", "");
  }, []);

  useEffect(() => {
    const tick = () => setClocks(STUDIOS.map((studio) => studioClock(studio)));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const labels = gsap.utils.toArray<HTMLElement>("[data-menu-label]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-menu-rule]", root);
      const fades = gsap.utils.toArray<HTMLElement>("[data-menu-fade]", root);

      if (!open) return;
      if (prefersReducedMotion()) {
        gsap.set(labels, { yPercent: 0 });
        gsap.set(rules, { scaleX: 1 });
        gsap.set(fades, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap
        .timeline()
        .fromTo(rules, { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 0.1, ease: "power3.inOut" }, 0.3)
        .fromTo(labels, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.5)
        .fromTo(fades, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.8);
    },
    { dependencies: [open], scope: rootRef },
  );

  const tabIndex = open ? 0 : -1;
  const close = (event: MouseEvent) => {
    if (!event.defaultPrevented) onClose();
  };

  return (
    <ClipNav
      open={open}
      id="raven-menu"
      origin="top"
      openDuration={0.9}
      closeDuration={instant ? 0 : 0.8}
      rootRef={rootRef}
      className="fixed inset-0 z-70 hidden overflow-y-auto overscroll-contain bg-(--raven-accent) text-(color:--raven-white) max-lg:block"
      innerClassName="flex min-h-full origin-top flex-col justify-between gap-14 px-[6vw] py-[5vw] max-md:gap-12 max-md:px-[7vw] max-md:py-[8vw]"
    >
      <nav aria-label="Menu" className="py-[calc(7vh+1vw)] max-md:py-[calc(5.8vh+4vw)]">
        <ul className="flex flex-col">
          {LINKS.map((link) => {
            const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} className="relative">
                <span data-menu-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-(--raven-white)/25" />
                <Link
                  href={link.href}
                  tabIndex={tabIndex}
                  aria-current={current ? "page" : undefined}
                  onClick={close}
                  className="group flex items-center justify-between gap-4 overflow-hidden py-[2.2vw] max-md:py-[3vw]"
                >
                  <span
                    data-menu-label
                    className={`block text-64 leading-[1.1] ${current ? "font-raven-serif italic" : "font-raven-head font-medium tracking-tight"}`}
                  >
                    {link.label}
                  </span>
                  <ArrowUpRight
                    className={`size-[4vw] shrink-0 transition-transform duration-500 group-hover:rotate-45 max-md:size-[6vw] ${current ? "opacity-100" : "opacity-50"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-10 max-md:gap-8">
        <div className="grid grid-cols-2 gap-14 max-lg:gap-8 max-md:gap-6">
          {STUDIOS.map((studio, index) => (
            <div key={studio.city} data-menu-fade className="flex flex-col gap-2 text-22">
              <span className="font-raven-head text-30 font-medium">{studio.city}</span>
              <span className="flex items-center gap-2 tabular-nums">
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${clocks[index].open ? "bg-(--raven-white)" : "border border-(--raven-white)/60"}`}
                />
                {clocks[index].time} {clocks[index].open ? "Open" : "Closed"}
              </span>
              <span className="text-(color:--raven-white)/90">
                {studio.address[0]}
                <br />
                {studio.address[1]}
              </span>
            </div>
          ))}
        </div>

        <div data-menu-fade className="flex flex-col gap-6">
          <div className="h-px w-full bg-(--raven-white)/25" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <UnderlineLink href={`mailto:${BRAND.email}`} tabIndex={tabIndex} persistent className="font-raven-head text-30 font-medium">
              {BRAND.email}
            </UnderlineLink>
            <ul className="flex gap-5 text-22">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" tabIndex={tabIndex} className="text-(color:--raven-white)/90 transition-colors hover:text-(color:--raven-white)">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ClipNav>
  );
};

export default Menu;
