import dynamic from "next/dynamic";
import { pageMetadata } from "../metadata";
import JournalHero from "../components/blog/JournalHero";

const FeaturedPost = dynamic(() => import("../components/blog/FeaturedPost"));
const PostGrid = dynamic(() => import("../components/blog/PostGrid"));

export const metadata = pageMetadata(
  "Journal | Raven",
  "Notes from the Oslo and Lisbon studios on the work, the tools and the people behind it. A new entry most months.",
  "/blog",
);

const page = () => (
  <>
    <JournalHero />
    <div className="px-[5vw] max-lg:px-[6vw] max-md:px-[7vw]">
      <FeaturedPost />
    </div>
    <section className="px-[5vw] pb-[8%] pt-[5%] max-lg:px-[6vw] max-lg:pb-[12%] max-lg:pt-[8%] max-md:px-[7vw] max-md:pb-[15%] max-md:pt-[12%]">
      <PostGrid />
    </section>
  </>
);

export default page;
