import dynamic from "next/dynamic";
import { pageMetadata } from "./metadata";
import Hero from "./components/home/Hero";
import { FadeUp, MaskReveal } from "./components/Animations/gsapAnim";
import UnderlineLink from "./components/Buttons/UnderlineLink";
import HydrateInTurn from "./components/shared/HydrateInTurn";
import { ROUTES } from "./routes";

const ClientWall = dynamic(() => import("./components/home/ClientWall"));
const Intro = dynamic(() => import("./components/home/Intro"));
const Journal = dynamic(() => import("./components/home/Journal"));
const Process = dynamic(() => import("./components/home/Process"));
const ReelReveal = dynamic(() => import("./components/home/ReelReveal"));
const Services = dynamic(() => import("./components/home/Services"));
const Testimonials = dynamic(() => import("./components/home/Testimonials"));
const WorkGrid = dynamic(() => import("./components/work/WorkGrid"));

export const metadata = pageMetadata(
  "Raven | Brand and Digital Studio Template",
  "A multi-page template for a brand and digital studio, with a showreel that grows out of the headline, full-width project stories and a process timeline.",
);

const page = () => {
  return (
    <>
      <Hero />
      <HydrateInTurn>
      <ReelReveal key="reel" />
      <Intro key="intro" />
      <WorkGrid
        key="work"
        limit={4}
        filters={false}
        heading={
          <MaskReveal as="h2" className="text-64! leading-none">
            Selected <span className="raven-accent">Work</span>
          </MaskReveal>
        }
        action={
          <FadeUp>
            <UnderlineLink href={ROUTES.work} persistent arrow className="font-raven-head text-24 font-medium">
              See all work
            </UnderlineLink>
          </FadeUp>
        }
      />
      <ClientWall key="clients" />
      <Process key="process" />
      <Services key="services" />
      <Testimonials key="testimonials" />
      <Journal key="journal" />
      </HydrateInTurn>
    </>
  );
};

export default page;
