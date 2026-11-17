
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeUp, LineReveal, MaskReveal } from "../Animations/gsapAnim";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import UnderlineLink from "../Buttons/UnderlineLink";
import RollText from "../shared/RollText";
import { useAfterLoad } from "../shared/useAfterLoad";
import { SERVICES } from "../services/services";
import { ROUTES } from "../../routes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HOLD = 0.4;
const TILT = 6;
const pad = (value: number) => String(value).padStart(2, "0");

const Services = () => {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  // The stacked cards wait off-screen inside a clipped box, so native lazy loading would
  // leave them blank until they slide in. They stay eager, but only join the page once it
  // has loaded (or the stack comes near), so they don't slow the first screen.
  const mediaReady = useAfterLoad(stackRef);

  useGSAP(
    () => {
      const stack = stackRef.current;
      if (!stack) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]", stack);
      const reduce = prefersReducedMotion();
      const below = () => window.innerHeight;
      const switchAt = cards.slice(1).map((_, index) => HOLD + index * (1 + HOLD) + 0.5);

      gsap.set(cards, { transformOrigin: "50% 50%", force3D: true });
      gsap.set(cards.slice(1), { y: below });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stack,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const time = tl.time();
          const next = switchAt.filter((at) => time >= at).length;
          if (next === activeRef.current) return;
          activeRef.current = next;
          setActive(next);
        },
      });

      tl.to({}, { duration: HOLD });

      cards.slice(1).forEach((card, index) => {
        const prev = cards[index];
        const at = HOLD + index * (1 + HOLD);
        const tilt = index % 2 === 0 ? TILT : -TILT;

        tl.fromTo(card, { y: below }, { y: 0, duration: 1, ease: "power1.out" }, at);

        if (reduce) {
          tl.to(prev, { autoAlpha: 0, duration: 1 }, at);
          return;
        }

        tl.fromTo(card, { rotation: -tilt * 0.5 }, { rotation: 0, duration: 1, ease: "power1.out" }, at)
          .to(prev, { scale: 0.5, y: () => -window.innerHeight * 0.05, duration: 1, ease: "power1.inOut" }, at)
          .to(prev, { keyframes: { rotation: [0, tilt, tilt * 0.4], easeEach: "sine.inOut" }, duration: 1 }, at)
          .to(prev, { autoAlpha: 0, duration: 1, ease: "power1.in" }, at);
      });

      tl.to({}, { duration: HOLD });
    },
    { scope: stackRef },
  );

  const current = SERVICES[active];

  return (
    <section id="services" aria-labelledby="services-title" className="flex flex-col items-center gap-[3vw] py-[8%] max-lg:gap-8 max-lg:py-[12%] max-md:py-[15%]">
      <div className="flex flex-col items-center gap-4 px-[5vw] text-center max-lg:px-[6vw] max-md:px-[7vw]">
        <MaskReveal as="h2" id="services-title" className="text-64! leading-none">
          Our <span className="raven-accent">Services</span>
        </MaskReveal>
        <LineReveal className="text-22 leading-[1.4] text-raven-muted max-md:text-base">Six disciplines in one team. Hire us for one or all six.</LineReveal>
        <FadeUp>
          <UnderlineLink href={ROUTES.services} persistent arrow className="font-raven-head text-24 font-medium text-raven-ink max-lg:text-lg">
            See all services
          </UnderlineLink>
        </FadeUp>
      </div>

      <div ref={stackRef} className="relative h-[750vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {SERVICES.map((service, index) => (
            <div key={service.id} className="pointer-events-none absolute inset-0 flex items-center justify-start px-[5vw] py-[9vh] max-lg:items-start max-lg:justify-center max-lg:px-[6vw] max-lg:py-[16vh] max-md:px-[6vw] max-md:py-[18vh]">
              <Link
                href={ROUTES.services}
                data-service-card
                aria-label={service.title}
                tabIndex={index === active ? 0 : -1}
                className="group pointer-events-auto relative block h-[47vw] w-[62vw] overflow-hidden will-change-transform max-lg:h-[54vw] max-lg:w-[80vw] max-md:h-[70vw] max-md:w-[88vw]"
              >
                {mediaReady && (
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    loading="eager"
                    sizes="(max-width: 767px) 90vw, (max-width: 1023px) 70vw, 50vw"
                    quality={90}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </Link>
            </div>
          ))}

          <div className="absolute right-[5vw] top-1/2 z-10 flex -translate-y-1/2 flex-col items-end gap-3 whitespace-nowrap text-right max-lg:top-auto max-lg:bottom-[8vh] max-lg:right-[6vw] max-lg:translate-y-0 max-md:bottom-[10vh] max-md:right-[6vw]">
            <span className="flex items-center gap-1 text-14 font-medium tabular-nums text-raven-muted max-lg:text-sm">
              <RollText text={pad(active + 1)} />
              <span>/ {pad(SERVICES.length)}</span>
            </span>
            <h3 className="font-raven-head text-[2.5vw]! font-medium leading-[1.2]! tracking-tight max-lg:text-[5.5vw]! max-md:text-[7.5vw]!">
              <Link href={ROUTES.services} className="transition-colors duration-300 hover:text-(color:--raven-accent)">
                <RollText text={current.title} className="justify-items-end" />
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
