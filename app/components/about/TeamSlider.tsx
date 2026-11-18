
"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeUp, LineReveal, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import { LinkedinIn } from "../Buttons/icons";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import { ArrowUpRight } from "../Buttons/icons";
import { ROUTES } from "../../routes";
import { TEAM } from "./members";

const pad = (value: number) => String(value).padStart(2, "0");

// The team as a sideways slider of portrait cards. Drag it with the mouse (it carries on a
// little when let go), use the arrows or a trackpad, or swipe on a phone. Hovering a card
// dims the others and brings up a LinkedIn button on its photo.
const TeamSlider = () => {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, startScroll: 0, lastX: 0, lastTime: 0, velocity: 0 });
  const [edges, setEdges] = useState({ start: true, end: false, progress: 0 });

  // Arrows and the progress line follow the scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max - 2, progress: max > 0 ? track.scrollLeft / max : 0 });
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToLeft = (left: number) => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    gsap.to(track, { scrollLeft: Math.max(0, Math.min(max, left)), duration: prefersReducedMotion() ? 0 : 0.9, ease: "power3.out", overwrite: "auto" });
  };

  // One card's width (plus the gap) per arrow press
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    scrollToLeft(track.scrollLeft + direction * (card.getBoundingClientRect().width + gap));
  };

  // Mouse drag; touch and trackpads use the browser's own scrolling
  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    gsap.killTweensOf(track);
    dragRef.current = { active: true, moved: false, startX: event.clientX, startScroll: track.scrollLeft, lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
  };

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || !track) return;
    const now = performance.now();
    drag.velocity = (event.clientX - drag.lastX) / Math.max(1, now - drag.lastTime);
    drag.lastX = event.clientX;
    drag.lastTime = now;
    if (Math.abs(event.clientX - drag.startX) > 5) drag.moved = true;
    track.scrollLeft = drag.startScroll - (event.clientX - drag.startX);
  };

  const endDrag = () => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag.active || !track) return;
    drag.active = false;
    // Carry on a little in the direction of the throw
    if (drag.moved) scrollToLeft(track.scrollLeft - drag.velocity * 320);
  };

  // A drag ends on a link; that shouldn't count as a click
  const onClickCapture = (event: MouseEvent) => {
    if (dragRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  // Called as a function, not rendered as <ArrowButton />: a component defined in here would
  // remount on every render and drop keyboard focus after each step
  const arrowButton = (direction: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => step(direction)}
      disabled={disabled}
      aria-label={direction === 1 ? "Next people" : "Previous people"}
      className="flex aspect-square h-[5.1vh] items-center justify-center rounded-full border border-(--raven-ink)/20 text-(color:--raven-ink) transition-colors duration-300 hover:border-(--raven-ink) hover:bg-(--raven-ink) hover:text-(color:--raven-paper) disabled:pointer-events-none disabled:opacity-30 max-lg:h-[4.1vh] max-md:h-[5.7vh]"
    >
      {direction === 1 ? <ArrowRight className="size-[40%]" strokeWidth={1.7} /> : <ArrowLeft className="size-[40%]" strokeWidth={1.7} />}
    </button>
  );

  return (
    <div className="flex flex-col gap-7 max-lg:gap-6">
      <ul
        ref={trackRef}
        data-lenis-prevent-horizontal
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="group/list flex cursor-grab scroll-px-[5vw] gap-x-4 overflow-x-auto px-[5vw] py-1 select-none active:cursor-grabbing max-lg:scroll-px-[6vw] max-lg:px-[6vw] max-md:snap-x max-md:snap-mandatory max-md:scroll-px-[7vw] max-md:px-[7vw] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {TEAM.map((member, index) => (
          <li
            key={member.id}
            className="group/card w-[20.8vw] shrink-0 snap-start transition-opacity duration-500 ease-out group-hover/list:[&:not(:hover)]:opacity-45 max-lg:w-[38vw] max-md:w-[72vw]"
          >
            <article className="flex flex-col gap-4 max-lg:gap-3">
              <FadeUp delay={index * 0.08} className="relative aspect-[4/5.1] overflow-hidden rounded-xl bg-(--raven-ink)/5">
                <Image
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  fill
                  draggable={false}
                  sizes="(max-width: 767px) 80vw, (max-width: 1023px) 40vw, 24vw"
                  quality={90}
                  className="object-cover object-[50%_25%] transition-[scale] duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover/card:scale-[104%] motion-reduce:transition-none"
                />
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="absolute right-[0.9vw] top-[0.9vw] flex aspect-square h-[4.2vh] scale-50 items-center justify-center rounded-full bg-(--raven-white) text-(color:--raven-ink) opacity-0 transition-[scale,opacity,background-color,color] duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] hover:bg-(--raven-accent) hover:text-(color:--raven-white) focus-visible:scale-100 focus-visible:opacity-100 group-hover/card:scale-100 group-hover/card:opacity-100 max-lg:right-3 max-lg:top-3 max-lg:h-[3.4vh] max-lg:scale-100 max-lg:opacity-100 max-md:h-[4.7vh]"
                >
                  <LinkedinIn className="size-[38%]" />
                </a>
              </FadeUp>
              <div className="flex flex-col gap-0.5 max-md:gap-0">
                <div className="flex items-baseline justify-between gap-3">
                  <MaskReveal as="h3" delay={index * 0.08} className="text-24">
                    <span className="font-medium">{member.name}</span>
                  </MaskReveal>
                  <FadeUp as="span" delay={index * 0.08 + 0.1} className="text-14 tabular-nums text-raven-muted">
                    {pad(index + 1)}
                  </FadeUp>
                </div>
                <LineReveal delay={index * 0.08 + 0.1} className="text-22 text-raven-muted">
                  {member.role}, {member.city}
                </LineReveal>
              </div>
            </article>
          </li>
        ))}

        {/* The last slide is an open role */}
        <li className="w-[20.8vw] shrink-0 snap-start transition-opacity duration-500 ease-out group-hover/list:[&:not(:hover)]:opacity-45 max-lg:w-[38vw] max-md:w-[72vw]">
          <FadeUp delay={TEAM.length * 0.08}>
            <Link
              href={ROUTES.contact}
              draggable={false}
              className="group/join relative flex aspect-[4/5.1] flex-col justify-between overflow-hidden rounded-xl bg-(--raven-accent) px-[2vw] py-[2vw] text-(color:--raven-white) max-lg:px-[4vw] max-lg:py-[4vw] max-md:px-[5vw] max-md:py-[5vw]"
            >
              <span aria-hidden className="absolute inset-0 bg-(--raven-ink) [clip-path:inset(100%_0%_0%_0%)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover/join:[clip-path:inset(0%_0%_0%_0%)] motion-reduce:transition-none" />
              <strong className="font-raven-head relative text-40 font-medium leading-[1.1]">This spot is yours.</strong>
              <span className="relative flex items-end justify-between gap-4">
                <span className="text-22 leading-[1.4]">We’re looking for a senior 3D designer to join the Oslo studio.</span>
                <ArrowUpRight className="size-[1.8vw] shrink-0 transition-transform duration-500 group-hover/join:rotate-45 max-lg:size-6" />
              </span>
            </Link>
          </FadeUp>
        </li>
      </ul>

      {/* Progress through the row, and the arrows */}
      <div className="flex items-center justify-between gap-11 px-[5vw] max-lg:gap-6 max-lg:px-[6vw] max-md:gap-3 max-md:px-[7vw]">
        <div aria-hidden className="relative h-px flex-1">
          <RuleDraw className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />
          <span
            className="absolute inset-y-0 left-0 w-[25%] bg-(--raven-ink) transition-[translate] duration-200"
            style={{ translate: `${edges.progress * 300}% 0` }}
          />
        </div>
        <FadeUp className="flex gap-2">
          {arrowButton(-1, edges.start)}
          {arrowButton(1, edges.end)}
        </FadeUp>
      </div>
    </div>
  );
};

export default TeamSlider;
