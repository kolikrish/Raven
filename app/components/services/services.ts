import type { StaticImageData } from "next/image";
import strategy from "../../assets/pictures/services/strategy.webp";
import identity from "../../assets/pictures/services/brand-identity.webp";
import web from "../../assets/pictures/services/products.webp";
import motion from "../../assets/pictures/services/motion-3d.webp";
import packaging from "../../assets/pictures/services/packaging.webp";
import content from "../../assets/pictures/services/content-campaign.webp";
export type Service = {
    id: string;
    title: string;
    text: string;
    tags: string[];
    image: StaticImageData;
    alt: string;
    brief: {
        weeks: number;
        people: number;
        after: string[];
        overlap?: number;
        form: string;
    };
};
export const SERVICES: Service[] = [
    {
        id: "strategy",
        title: "Brand Strategy",
        text: "The one sentence your company stands behind, and the words that follow from it.",
        tags: ["Interviews", "Positioning", "Naming", "Messaging", "Voice"],
        image: strategy,
        alt: "Two people leaning over a white desk covered in printed charts, one marking a page with a pen beside sticky notes and a laptop",
        brief: { weeks: 3, people: 2, after: [], form: "Strategy" }
    },
    {
        id: "identity",
        title: "Brand Identity",
        text: "Marks, type and colour drawn by hand first, then built to hold up at any size.",
        tags: ["Marks and wordmarks", "Type and colour", "Brand books", "Templates"],
        image: identity,
        alt: "A laptop on a stone desk showing a minimal “raven Creative Studio” website, with a ceramic cup and white blossoms in soft window light",
        brief: { weeks: 6, people: 3, after: ["strategy"], form: "Identity" }
    },
    {
        id: "web",
        title: "Websites and Products",
        text: "Sites and product screens that load quickly and work for everyone who opens them.",
        tags: [
            "Interface design",
            "Webflow or Next.js",
            "Component libraries",
            "Accessibility",
        ],
        image: web,
        alt: "A laptop on a wooden desk showing a furniture shop page with a yellow sofa, beside a phone, coffee cup, mouse and printed brochure",
        brief: { weeks: 8, people: 4, after: ["identity"], overlap: 2, form: "Website" }
    },
    {
        id: "motion",
        title: "Motion and 3D",
        text: "Logos that move, launch films and renders of products that don’t exist yet.",
        tags: ["Animated marks", "Launch films", "3D renders", "Interface motion"],
        image: motion,
        alt: "Glossy translucent ribbon loops glowing copper-orange on black, crossed by a thin orbit line with a small sphere",
        brief: { weeks: 4, people: 2, after: ["identity"], form: "Motion" }
    },
    {
        id: "packaging",
        title: "Packaging",
        text: "Boxes, tins and labels that get picked up first and thrown away last.",
        tags: ["Structure", "Range design", "Print production", "Materials"],
        image: packaging,
        alt: "Plain cardboard boxes scattered across dark roller conveyor belts, seen from above",
        brief: { weeks: 5, people: 2, after: ["identity"], overlap: 1, form: "Packaging" }
    },
    {
        id: "campaigns",
        title: "Content and Campaigns",
        text: "Launch ideas, shoots and social plans that give people a reason to look up.",
        tags: ["Launch ideas", "Social plans", "Shoots", "Copywriting"],
        image: content,
        alt: "Wooden letter tiles spelling “Content Creator” in a wooden grid",
        brief: { weeks: 4, people: 2, after: ["identity", "motion"], form: "Campaign" }
    },
];
export type Engagement = "project" | "retainer" | "sprint";
export const ENGAGEMENTS: {
    value: Engagement;
    name: string;
    tag: string;
    text: string;
    best: string;
}[] = [
    {
        value: "project",
        name: "Project",
        tag: "Fixed fee",
        text: "The work, the fee and the launch date, agreed in the first meeting. None of them move.",
        best: "New brands, websites and packaging ranges"
    },
    {
        value: "retainer",
        name: "Retainer",
        tag: "Month by month",
        text: "Set studio days each month, with the same named people, booked a quarter ahead.",
        best: "Teams with a steady stream of work"
    },
    {
        value: "sprint",
        name: "Sprint",
        tag: "One two-week block",
        text: "A single question, a small team and a hard stop on day ten. You leave with the answer.",
        best: "A naming round, an investor deck, a product page"
    },
];
