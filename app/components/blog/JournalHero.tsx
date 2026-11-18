
import { LineReveal, MaskReveal } from "../Animations/gsapAnim";
import { PAGE_DELAY } from "../Animations/timing";

// A wide headline with the intro set to its right
const JournalHero = () => (
  <section className="flex flex-col gap-10 px-[5vw] pb-[7vh] pt-[22vh] max-lg:gap-8 max-lg:px-[6vw] max-lg:pt-[16vh] max-md:gap-6 max-md:px-[7vw] max-md:pb-[10vw] max-md:pt-[34vw]">
    <MaskReveal as="h1" delay={PAGE_DELAY} className="w-[85%] max-lg:w-full">
      Honest Notes on Building Brands <span className="raven-accent">Faster</span>
    </MaskReveal>
    <LineReveal
      delay={PAGE_DELAY + 0.3}
      className="w-[32%] self-end text-28 text-raven-muted max-lg:w-[70%] max-lg:self-start max-md:w-full"
    >
      Notes from the Oslo and Lisbon studios on the work, the tools and the people behind it. A new entry most months.
    </LineReveal>
  </section>
);

export default JournalHero;
