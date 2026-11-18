import dynamic from "next/dynamic";
import { pageMetadata } from "../metadata";
import { ROUTES } from "../routes";
import { FadeUp } from "../components/Animations/gsapAnim";
import PageHero from "../components/shared/PageHero";
import SectionHead from "../components/shared/SectionHead";

const AnimatedFaq = dynamic(() => import("../components/effects/animated-faq"));
const BriefBuilder = dynamic(() => import("../components/services/BriefBuilder"));
const KineticRow = dynamic(() => import("../components/services/KineticRow"));
const RunList = dynamic(() => import("../components/services/RunList"));
const ServiceShowcase = dynamic(() => import("../components/services/ServiceShowcase"));

export const metadata = pageMetadata(
  "Services | Raven",
  "Six disciplines, one team, two studios. What Raven makes, how long it takes and what it costs.",
  "/services",
);

const page = () => (
  <>
    <PageHero
      crumbs={[{ label: "Home", href: ROUTES.home }, { label: "Services" }]}
      title={
        <>
          Six Disciplines.
          <br />
          <span className="raven-accent">Zero</span> Hand-offs.
        </>
      }
      textClassName="w-[45%]"
      containerClassName="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw]"
      text="One team in Oslo and Lisbon, from the first interview to the final print file. Book one discipline or all six. Most first projects are an identity. The second is everything around it."
    />
    <ServiceShowcase />
    <KineticRow />
    <section className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw] raven-section flex flex-col gap-14 max-lg:gap-11">
      <SectionHead
        stacked={false}
        title={
          <>
            Build Your <span className="raven-accent">Brief</span>
          </>
        }
        text="Tick what you need and pick how you want to work. Each bar shows when a discipline runs, week by week, so you can see when every part happens."
        textClassName="w-[40%]"
      />
      <BriefBuilder />
    </section>
    <section className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw] flex flex-col gap-14 max-lg:gap-11">
      <SectionHead
        stacked={false}
        title={
          <>
            How a Project <span className="raven-accent">Runs</span>
          </>
        }
        text="About ten weeks for a typical identity, planned in two-week blocks. Nothing moves on until you’ve said yes."
        textClassName="w-[35%]"
      />
      <RunList runs={RUNS} />
    </section>
    <section className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw] raven-section flex flex-col gap-14 max-lg:gap-11">
      <SectionHead
        stacked={false}
        title={
          <>
            Questions People <span className="raven-accent">Ask</span>
          </>
        }
      />
      <FadeUp>
        <AnimatedFaq items={FAQ} />
      </FadeUp>
    </section>
  </>
);

export default page;

const RUNS = [
  {
    title: "Listen First",
    text: "We talk to your team, your customers and the ones who bought elsewhere, and write down whatever keeps coming up.",
    time: "Weeks 1 to 2",
    on: [0, 1],
  },
  {
    title: "Pin It Down",
    text: "All of that becomes one line about why you exist. If your sales team can’t say it from memory, we rewrite it.",
    time: "Weeks 3 to 4",
    on: [2, 3],
  },
  {
    title: "Draw, Then Build",
    text: "Pencil sketches at the long table, then two or three directions shown on your real signs, screens and packs. You pick one and we build the kit.",
    time: "Weeks 5 to 9",
    on: [4, 5, 6, 7, 8],
  },
  {
    title: "Hand It Over",
    text: "Every file, every guideline and a training morning for your team. We stay on call while it goes live, and we pick up when you ring.",
    time: "Week 10 onward",
    on: [9, 10, 11],
  },
];

const FAQ = [
  {
    question: "Can we book just one discipline?",
    answer:
      "Yes, and plenty of clients do. A website for a brand that already works, or a new tin range for an old favourite, is a normal week for us.",
  },
  {
    question: "Oslo or Lisbon: who actually does the work?",
    answer:
      "Both. Every project has one lead in the studio nearest you, and the rest of the team is picked for the job, whichever city they sit in. Oslo and Lisbon are an hour apart, so the working day overlaps almost completely.",
  },
  {
    question: "How far ahead do you book?",
    answer:
      "Usually five to seven weeks. If a two-week sprint is all you need, we can sometimes fit it in sooner.",
  },
  {
    question: "What if we already have designers?",
    answer:
      "Good. We set the direction and build the kit with them, so the people who keep it running were in the room when it was made.",
  },
  {
    question: "What should we budget?",
    answer:
      "Every service page lists its prices. A full identity usually costs between $18,000 and $60,000, depending on how many markets it has to work in.",
  },
];
