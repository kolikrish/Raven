
import type { StaticImageData } from "next/image";
import journal1 from "../../assets/pictures/blog/featured.webp";
import journal2 from "../../assets/pictures/blog/rebrand.webp";
import journal3 from "../../assets/pictures/blog/constant-speed.webp";
import journal4 from "../../assets/pictures/blog/small-words.webp";
import journal5 from "../../assets/pictures/blog/tuesday.webp";
import journal6 from "../../assets/pictures/blog/typeface.webp";
import journal7 from "../../assets/pictures/blog/timeline.webp";
import journal8 from "../../assets/pictures/blog/ideas.webp";
import journal9 from "../../assets/pictures/blog/second-product.webp";

export type Post = {
  category: string;
  date: string;
  dateTime: string;
  title: string;
  excerpt: string;
  image: StaticImageData;
  alt: string;
};

export const POSTS: Post[] = [
  {
    category: "Branding",
    date: "Sep 9, 2026",
    dateTime: "2026-09-09",
    title: "The Rebrand Is the Cheap Part. Running It Isn’t.",
    excerpt: "Font licences, new signs, templates and training. The costs that turn up in year two, and how we plan for them in week one.",
    image: journal2,
    alt: "Wooden letter blocks spelling “Rethink”, “Revise” and “Rebrand” between curved arrows",
  },
  {
    category: "Design",
    date: "Aug 27, 2026",
    dateTime: "2026-08-27",
    title: "Nothing Real Moves at a Constant Speed.",
    excerpt: "Weight, arcs and a little hesitation. Why every motion system we build starts with a ball dropped on a desk.",
    image: journal3,
    alt: "An hourglass beside a laptop showing a project tracker marked “On Track”",
  },
  {
    category: "Branding",
    date: "Aug 12, 2026",
    dateTime: "2026-08-12",
    title: "The Smallest Words on a Brand Do the Most Work.",
    excerpt: "Buttons, labels, error messages. Nobody briefs them, everybody reads them. Where a brand’s voice actually lives.",
    image: journal4,
    alt: "A brand checklist in a notebook beside a laptop showing a website headline and a mug labelled “Brand”",
  },
  {
    category: "Process",
    date: "Jul 30, 2026",
    dateTime: "2026-07-30",
    title: "We Launch on Tuesdays, Quietly, and Tell People Later.",
    excerpt: "No countdowns, no Friday deploys. A new website gets a week to find its feet before anyone announces it.",
    image: journal5,
    alt: "A July desk calendar with the 30th circled and a sticky note reading “Launch”, beside an hourglass",
  },
  {
    category: "Design",
    date: "Jul 15, 2026",
    dateTime: "2026-07-15",
    title: "Choose a Typeface by Its Ø and Its Ç.",
    excerpt: "Half our clients write in Norwegian, half in Portuguese. The letters most foundries draw last are the ones we test first.",
    image: journal6,
    alt: "The letters Ø and Ç drawn large on paper, annotated as Norwegian and Portuguese",
  },
  {
    category: "Process",
    date: "Jun 30, 2026",
    dateTime: "2026-06-30",
    title: "Every Timeline We Write Has an Empty Week in It.",
    excerpt: "Not padding. A gap before launch, kept for the problem nobody has spotted yet. There is always one.",
    image: journal7,
    alt: "A weekly planner with tasks ticked off and the last week marked “Buffer Week”",
  },
  {
    category: "Studio",
    date: "Jun 18, 2026",
    dateTime: "2026-06-18",
    title: "Friday Crit: We Kill Our Own Ideas So Clients Don’t Have To.",
    excerpt: "Every Friday both studios put the week’s work on screen and argue about it. Most of it doesn’t make it to Monday.",
    image: journal8,
    alt: "A sticky note for each weekday on a glass board, with Friday’s circled “Kill ideas” above a bin of crumpled paper",
  },
  {
    category: "Design",
    date: "Jun 2, 2026",
    dateTime: "2026-06-02",
    title: "The Second Product Is Always Harder Than the First.",
    excerpt: "A brand built for one jar has to survive a whole shelf. How we design for the range a client hasn’t made yet.",
    image: journal9,
    alt: "Two jars of crumpled paper labelled V1 and V2, marked “First product” and “Second product”",
  },
];

export const FEATURED_POST: Post = {
  category: "Studio",
  date: "Sep 24, 2026",
  dateTime: "2026-09-24",
  title: "Every Project Gets a Logbook, and the Client Keeps It.",
  excerpt: "Decisions, dead ends and the reasons behind both, written down every week. It’s the most useful thing we hand over.",
  image: journal1,
  alt: "An open notebook titled “Project Logbook” with ticked notes and sticky notes, beside a pen and a coffee cup",
};

