
"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeUp, LineReveal, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import ParallaxImage from "../effects/parallax-image";
import { SERVICES, type Service } from "./services";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const letter = (index: number) => String.fromCharCode(65 + index);

// Clip shapes, as inset(top right bottom left): open, or shut into one corner
const OPEN = "inset(0% 0% 0% 0%)";
const TOP_LEFT = "inset(0% 100% 100% 0%)";
const BOTTOM_RIGHT = "inset(100% 0% 0% 100%)";

// Desktop pins the photo beside the list; smaller screens and reduced motion stack each
// service with its own photo
const PIN_QUERY = "(min-width: 1024px)";
const subscribePinned = (onChange: () => void) => {
  const query = window.matchMedia(PIN_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getPinned = () => window.matchMedia(PIN_QUERY).matches && !prefersReducedMotion();
const getServerPinned = () => false;

const ServiceText = ({ service, index }: { service: Service; index: number }) => (
  <>
    <FadeUp as="span" className="text-14 tabular-nums text-raven-muted">{letter(index)}/</FadeUp>
    <MaskReveal as="h3" className="text-64">{service.title}</MaskReveal>
    <LineReveal delay={0.1} className="w-[90%] text-24 leading-[1.4] text-raven-muted max-md:w-full">{service.text}</LineReveal>
    <FadeUp as="ul" delay={0.2} className="flex flex-wrap gap-2">
      {service.tags.map((tag) => (
        <li key={tag} className="rounded-full bg-(--raven-ink)/6 px-[1vw] py-[0.5vw] text-14 font-medium max-lg:px-4 max-lg:py-2">
          {tag}
        </li>
      ))}
    </FadeUp>
  </>
);

// The services scroll past on the left while one photo stays put on the right. The swap
// between two photos is tied to the scroll: as the next service rises toward the middle of
// the screen, its photo grows from the bottom-right corner and the last one shrinks into the
// top left. A fast scroll plays the whole swap quickly, and scrolling back runs it in reverse.
const PinnedServices = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const photos = gsap.utils.toArray<HTMLElement>("[data-service-photo]");
      gsap.utils.toArray<HTMLElement>("[data-service-block]").forEach((block, index) => {
        // The text and caption follow whichever service is crossing the middle
        ScrollTrigger.create({
          trigger: block,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setStep(index),
        });
        if (index === 0) return;
        const incoming = photos[index];
        const outgoing = photos[index - 1];
        gsap
          .timeline({ scrollTrigger: { trigger: block, start: "top 85%", end: "top 40%", scrub: true } })
          .fromTo(incoming, { clipPath: BOTTOM_RIGHT }, { clipPath: OPEN, ease: "power2.inOut", immediateRender: false }, 0)
          .fromTo(
            incoming.querySelector("[data-service-zoom]"),
            { scale: 1.5, transformOrigin: "100% 100%" },
            { scale: 1, ease: "power2.out", immediateRender: false },
            0,
          )
          .fromTo(outgoing, { clipPath: OPEN }, { clipPath: TOP_LEFT, ease: "power2.inOut", immediateRender: false }, 0)
          .fromTo(outgoing.querySelector("[data-service-zoom]"), { scale: 1 }, { scale: 1.2, ease: "power2.in", immediateRender: false }, 0);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} aria-label="Our services" className="relative grid grid-cols-12 gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 px-[5vw]">
      <ol className="col-span-6 flex flex-col py-[15vh]">
        {SERVICES.map((service, index) => (
          <li
            key={service.id}
            data-service-block
            className={`relative flex min-h-[70vh] flex-col items-start justify-center gap-5 max-lg:gap-3 max-md:gap-1 transition-opacity duration-700 ${
              index === step ? "opacity-100" : "opacity-30"
            }`}
          >
            {index > 0 && <RuleDraw className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />}
            <ServiceText service={service} index={index} />
          </li>
        ))}
      </ol>

      <div className="col-span-5 col-start-8">
        <figure className="sticky top-0 flex h-screen flex-col justify-center gap-4">
          <div className="relative aspect-4/5 w-[min(100%,66vh)] overflow-hidden rounded-lg max-lg:rounded-sm max-md:rounded-xs">
            {SERVICES.map((service, index) => (
              <div
                key={service.id}
                data-service-photo
                className={`absolute inset-0 overflow-hidden ${
                  index === 0 ? "[clip-path:inset(0%_0%_0%_0%)]" : "[clip-path:inset(100%_0%_0%_100%)]"
                }`}
              >
                <div data-service-zoom className="absolute inset-0">
                  <Image src={service.image} alt={service.alt} fill sizes="40vw" quality={90} className="object-cover" />
                </div>
              </div>
            ))}
          </div>
          <figcaption className="flex w-[min(100%,66vh)] items-center justify-between gap-6 text-14 text-raven-muted">
            <span className="text-(color:--raven-ink)">{SERVICES[step].title}</span>
            <span className="tabular-nums">
              {letter(step)} / {letter(SERVICES.length - 1)}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

const StackedServices = () => (
  <section aria-label="Our services" className="flex flex-col px-[5vw] max-lg:px-[6vw] max-md:px-[7vw]">
    {SERVICES.map((service, index) => (
      <div key={service.id} className="relative grid grid-cols-12 items-center gap-x-6 gap-y-6 py-[6vw] max-md:py-12">
        {index > 0 && <RuleDraw className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />}
        <div className="col-span-7 flex flex-col items-start gap-4 max-md:col-span-12">
          <ServiceText service={service} index={index} />
        </div>
        <ParallaxImage
          reveal
          image={service.image}
          alt={service.alt}
          sizes="(max-width: 767px) 90vw, 40vw"
          className="col-span-5 aspect-4/5 rounded-3xl max-lg:rounded-xl max-md:rounded-lg max-md:col-span-12"
        />
      </div>
    ))}
  </section>
);

const ServiceShowcase = () => {
  const pinned = useSyncExternalStore(subscribePinned, getPinned, getServerPinned);
  return pinned ? <PinnedServices /> : <StackedServices />;
};

export default ServiceShowcase;
