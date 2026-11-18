import { pageMetadata } from "../metadata";
import WorkIndex from "../components/work/WorkIndex";

export const metadata = pageMetadata(
  "Work | Raven",
  "Brand identities, websites, motion and packaging from Raven’s studios in Oslo and Lisbon.",
  "/work",
);

const page = () => <WorkIndex />;

export default page;
