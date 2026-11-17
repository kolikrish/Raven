
import Image from "next/image";
import { FadeUp, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import UnderlineLink from "../Buttons/UnderlineLink";
import { ScrollCounter } from "../effects/number-counter";
import { ROUTES } from "../../routes";
import { STUDIOS } from "../../brand";
import studioPhoto from "../../assets/pictures/home/studio-team.webp";

// The studio's vital signs. Edit freely; the grid takes any even number of facts.
const FACTS = [
  { value: "2018", label: "Founded in Oslo" },
  { value: String(STUDIOS.length), label: STUDIOS.map((studio) => studio.city).join(" and ") },
  { value: "22", label: "Designers, writers and engineers" },
  { value: "140+", label: "Brands taken from sketch to launch" },
  { value: "5", label: "Days from kickoff to first sketch" },
  { value: "31", label: "Awards since 2018" },
];

// The studio statement, then a fact sheet beside a photo of the team at work
const Intro = () => (
  <section id="about" className="px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[15%]">
    <div className="grid grid-cols-12 gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 gap-y-8 pb-[6vw] max-md:pb-14">
      <div className="col-span-9 col-start-4 flex flex-col items-start gap-9 max-lg:gap-6 max-lg:col-span-12 max-lg:col-start-1">
        <MaskReveal
          as="p"
          scrub
          data-cursor-fill
          className="font-raven-head text-64 font-normal leading-[1.15] tracking-tight text-raven-muted max-md:text-[8.4vw]!"
        >
          <span className="text-raven-ink">A small studio for brands that would rather be useful than loud.</span> We
          write, design and build the whole thing, then stay to see whether it worked.
        </MaskReveal>
        <FadeUp>
          <UnderlineLink href={ROUTES.about} persistent arrow className="font-raven-head text-24 font-medium text-raven-ink">
            Meet the studio
          </UnderlineLink>
        </FadeUp>
      </div>
    </div>

    <div className="grid grid-cols-12 items-end gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 gap-y-12">
      <div className="relative col-span-5 max-lg:col-span-12">
        <RuleDraw syncWithFade className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/15" />
        <dl className="grid grid-cols-2">
          {FACTS.map((fact, index) => (
            <FadeUp
              key={fact.label}
              delay={index * 0.06}
              className="relative flex flex-col gap-2 py-[1.4vw] odd:pr-[1.5vw] even:pl-[1.5vw] max-lg:py-5 max-lg:odd:pr-5 max-lg:even:pl-5"
            >
              <RuleDraw syncWithFade delay={index * 0.06} className="absolute inset-x-0 bottom-0 h-px bg-(--raven-ink)/15" />
              {index % 2 === 1 && <RuleDraw syncWithFade vertical delay={index * 0.06} className="absolute inset-y-0 left-0 w-px bg-(--raven-ink)/15" />}
              <dt className="order-2 text-14 leading-[1.4] text-raven-muted">{fact.label}</dt>
              <dd className="font-raven-head order-1 text-[3.4vw] font-medium leading-none tracking-tight max-lg:text-[7vw] max-md:text-[9vw]">
                <ScrollCounter value={fact.value} delay={index * 0.06} />
              </dd>
            </FadeUp>
          ))}
        </dl>
      </div>

      <FadeUp delay={0.1} className="col-span-6 col-start-7 max-lg:col-span-12 max-lg:col-start-1">
        <figure className="flex flex-col gap-3">
          <div className="relative aspect-3/2 overflow-hidden rounded-lg max-lg:rounded-sm max-md:rounded-lg max-md:aspect-4/5">
            <Image
              src={studioPhoto}
              alt="Two people from the studio checking a shot on a camera between studio lights"
              fill
              sizes="(max-width: 767px) 160vw, (max-width: 1023px) 90vw, 50vw"
              quality={90}
              className="object-cover"
            />
          </div>
         
        </figure>
      </FadeUp>
    </div>
  </section>
);

export default Intro;
