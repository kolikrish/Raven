
"use client";

import Image from "next/image";
import { FadeUp, LineReveal, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import { PROJECTS } from "../work/projects";

// The quotes come from the projects' case studies (projects.ts), so they stay in step.
// One featured quote set large beside that project's photo, then two shorter ones.
const byTitle = (title: string) => PROJECTS.find((project) => project.title === title) ?? PROJECTS[0];
const toQuote = (title: string) => {
  const project = byTitle(title);
  const { text, name, role, image } = project.story.quote;
  // A quote without a portrait falls back to the project photo
  return { quote: text, name, role, image: image ?? project.image, imageAlt: image ? `Portrait of ${name}` : project.alt, project: project.image, projectAlt: project.alt };
};

const FEATURED = toQuote("Maré");
const MORE = [toQuote("Nordvind"), toQuote("Puls")];

const Testimonials = () => (
  <section id="stories" aria-label="Client words" className="px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[15%]">
    <div className="relative grid grid-cols-12 gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 gap-y-10 pt-[3vw] max-md:pt-8">
      <RuleDraw className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />
      <FadeUp className="col-span-4 max-lg:col-span-5 max-md:col-span-12">
        <div className="relative aspect-4/5 overflow-hidden rounded-lg max-lg:rounded-sm max-md:rounded-lg">
          <Image src={FEATURED.project} alt={FEATURED.projectAlt} fill sizes="(max-width: 767px) 110vw, (max-width: 1023px) 50vw, 40vw" quality={90} className="object-cover" />
        </div>
      </FadeUp>

      <figure className="col-span-7 col-start-6 flex flex-col justify-between gap-10 max-lg:col-span-7 max-lg:col-start-6 max-md:col-span-12 max-md:col-start-1">
        <blockquote>
          <MaskReveal as="p" className="font-raven-head text-[3.3vw] leading-[1.12] tracking-tight max-lg:text-[4.4vw] max-md:text-[7vw]">
            “{FEATURED.quote}”
          </MaskReveal>
        </blockquote>
        <FadeUp as="figcaption" className="flex items-center gap-3">
          <span className="relative size-[3.4vw] shrink-0 overflow-hidden rounded-full max-lg:size-14">
            <Image src={FEATURED.image} alt={FEATURED.imageAlt} fill sizes="64px" className="object-cover" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-24">{FEATURED.name}</span>
            <span className="text-14 text-raven-muted">{FEATURED.role}</span>
          </span>
        </FadeUp>
      </figure>
    </div>

    <div className="relative mt-[4vw] max-md:mt-12">
      <RuleDraw className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />
      <ul className="grid grid-cols-2 max-md:grid-cols-1">
        {MORE.map((item, index) => (
          <li
            key={item.name}
            className={`relative flex flex-col justify-between gap-8 py-[2.6vw] max-md:py-8 ${index === 0 ? "pr-[2.6vw] max-md:pr-0" : "pl-[2.6vw] max-md:pl-0"}`}
          >
            {index === 0 ? (
              <span className="absolute inset-y-0 right-0 max-md:hidden">
                <RuleDraw vertical className="h-full w-px bg-(--raven-ink)/15" />
              </span>
            ) : (
              <span className="absolute inset-x-0 top-0 hidden max-md:block">
                <RuleDraw className="h-px w-full bg-(--raven-ink)/15" />
              </span>
            )}
            <LineReveal delay={index * 0.1} className="text-28 leading-[1.4] max-md:text-[4.6vw]!">
              “{item.quote}”
            </LineReveal>
            <FadeUp delay={index * 0.1 + 0.2} className="flex items-center gap-3">
              <span className="relative size-[3vw] shrink-0 overflow-hidden rounded-full max-lg:size-12">
                <Image src={item.image} alt={item.imageAlt} fill sizes="48px" className="object-cover" />
              </span>
              <span className="flex flex-col">
                <span className="text-22">{item.name}</span>
                <span className="text-14 text-raven-muted">{item.role}</span>
              </span>
            </FadeUp>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Testimonials;
