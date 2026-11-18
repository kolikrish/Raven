
import SectionHead from "../shared/SectionHead";
import TeamSlider from "./TeamSlider";

const Team = () => (
  <section id="team" className="flex flex-col gap-14 overflow-x-clip py-[8%] max-lg:gap-11 max-lg:py-[12%] max-md:py-[15%]">
    <div className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw]">
      <SectionHead
        stacked={false}
        title={
          <>
            The People You’ll <span className="raven-accent">Actually</span> Meet
          </>
        }
        text="Eight of the twenty-two, split between Oslo and Lisbon. The people who sketch your first idea are the people who ship the last file."
      />
    </div>
    <TeamSlider />
  </section>
);

export default Team;
