
import SectionHead from "../shared/SectionHead";
import AwardsIndex from "./AwardsIndex";

const ShelfSpace = () => (
  <section className="flex flex-col gap-14 max-lg:gap-11 px-[5vw] max-lg:px-[6vw] max-md:px-[7vw] py-[8%] max-lg:py-[12%] max-md:py-[15%]">
    <SectionHead
      stacked={false}
      title={
        <>
          A Few <span className="raven-accent">Awards</span>
        </>
      }
      text="We don’t enter many. These are the ones the clients were proudest of."
    />
    <AwardsIndex />
  </section>
);

export default ShelfSpace;
