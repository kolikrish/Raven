import dynamic from "next/dynamic";
import { pageMetadata } from "../metadata";
import AboutHero from "../components/about/AboutHero";

const Beliefs = dynamic(() => import("../components/about/Beliefs"));
const ShelfSpace = dynamic(() => import("../components/about/ShelfSpace"));
const Team = dynamic(() => import("../components/about/Team"));

export const metadata = pageMetadata(
  "About | Raven",
  "Who runs Raven, what we believe and how our Oslo and Lisbon studios work as one team.",
  "/about",
);

const page = () => (
  <>
    <AboutHero />
    <Beliefs />
    <Team />
    <ShelfSpace />
  </>
);

export default page;
