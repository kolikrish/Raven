
import { ROUTES } from "../../routes";
import { FadeUp, LineReveal, MaskReveal } from "../Animations/gsapAnim";
import { PAGE_DELAY } from "../Animations/timing";
import ParallaxImage from "../effects/parallax-image";
import Breadcrumb from "../shared/Breadcrumb";
import { BRAND } from "../../brand";
import { FOUNDER } from "./members";
import studioOslo from "../../assets/pictures/about/studio-oslo.webp";
import studioLisbon from "../../assets/pictures/about/studio-lisbon.webp";

const AboutHero = () => (
  <>
    <section className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw] flex h-screen flex-col gap-11 py-[8%] max-lg:h-auto max-lg:min-h-screen max-lg:gap-8 max-lg:py-[12%] max-md:gap-9 max-md:py-[25vw]">
      <Breadcrumb crumbs={[{ label: "Home", href: ROUTES.home }, { label: "About" }]} />
      <div className="grid flex-1 grid-cols-12 content-end items-end gap-x-12 gap-y-10 max-md:gap-y-8 max-lg:gap-x-8 max-md:gap-x-0">
        <MaskReveal
          as="h1"
          delay={PAGE_DELAY}
          className="col-span-8 w-[92%] max-lg:col-span-12 max-lg:w-full"
        >
          A Small, Senior Studio for Brands Worth <span className="raven-accent">Remembering.</span>
        </MaskReveal>
        <figure className="col-span-4 col-start-9 row-span-2 flex flex-col gap-3 self-start max-lg:col-span-12 max-lg:col-start-1 max-lg:row-auto max-lg:w-[56%] max-md:w-full">
          <ParallaxImage
            reveal
            image={FOUNDER.image}
            alt={`${FOUNDER.name}, founder of ${BRAND.name}`}
            sizes="(max-width: 767px) 110vw, (max-width: 1023px) 70vw, 40vw"
            priority
            className="aspect-[4/5] rounded-lg"
          />
          <FadeUp as="figcaption" delay={PAGE_DELAY + 0.3} className="flex justify-between gap-4 text-14 text-raven-muted">
            <span className="text-(color:--raven-ink)">{FOUNDER.name}</span>
            <span>Founder, {FOUNDER.city}</span>
          </FadeUp>
        </figure>
        <LineReveal delay={PAGE_DELAY + 0.3} className="col-span-6 w-[90%] text-28 leading-[1.4] text-raven-muted max-lg:col-span-12 max-lg:w-[75%] max-md:w-full">
          {`${BRAND.name} started in Oslo in 2018 on one hunch: a small team of senior people makes braver work than a big agency. Two studios and twenty-two people later, it still holds.`}
        </LineReveal>
      </div>
    </section>

    <div className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw] py-[8%] max-lg:py-[12%] max-md:py-[15%]">
      <div className="grid grid-cols-[7fr_5fr] gap-12 max-lg:gap-8 max-lg:grid-cols-1 max-md:gap-5">
        <ParallaxImage
          reveal
          image={studioOslo}
          alt="The Oslo studio: a bright shoot space with lights and lounge chairs"
          className="aspect-[16/11] rounded-lg"
          sizes="(max-width: 767px) 90vw, 56vw"
        />
        <ParallaxImage
          reveal
          image={studioLisbon}
          alt="Two designers working in front of the shelves in the Lisbon studio"
          className="rounded-lg max-lg:aspect-[16/11]"
          sizes="(max-width: 767px) 90vw, 40vw"
        />
      </div>
    </div>
  </>
);

export default AboutHero;
