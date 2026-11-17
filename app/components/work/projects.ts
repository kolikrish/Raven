import type { StaticImageData } from "next/image";
import fjellform from "../../assets/pictures/work/work-fjellform.webp";
import sardinha from "../../assets/pictures/work/work-sardinha.webp";
import nordvind from "../../assets/pictures/work/work-nordvind.webp";
import mare from "../../assets/pictures/work/work-mare.webp";
import kvist from "../../assets/pictures/work/work-kvist.webp";
import puls from "../../assets/pictures/work/work-puls.webp";
import torra from "../../assets/pictures/work/work-torra.webp";
import ferja from "../../assets/pictures/work/work-ferja.webp";
import client1 from "../../assets/pictures/work/client-1.webp";
import client2 from "../../assets/pictures/work/client-2.webp";
import client3 from "../../assets/pictures/work/client-3.webp";
import client4 from "../../assets/pictures/work/client-4.webp";
import client5 from "../../assets/pictures/work/client-5.webp";
import client6 from "../../assets/pictures/work/client-6.webp";
export type Project = {
    title: string;
    meta: string;
    year: string;
    cats: string[];
    image: StaticImageData;
    alt: string;
    result: {
        value: string;
        label: string;
    };
    sector: string;
    story: {
        quote: {
            text: string;
            name: string;
            role: string;
            image?: StaticImageData;
        };
    };
};
export const PROJECTS: Project[] = [
    {
        title: "Fjellform",
        meta: "Identity, e-commerce",
        year: "2026",
        cats: ["branding", "web"],
        sector: "Outdoor gear",
        image: fjellform,
        alt: "A hiker in a bright yellow hood against a hazy mountain range",
        result: { value: "+58%", label: "online revenue in the first season" },
        story: {
            quote: {
                text: "They spent a week in the workshop before they drew anything. It shows: the brand sounds like us on a good day.",
                name: "Erik Nygaard",
                role: "Founder, Fjellform",
                image: client1
            }
        }
    },
    {
        title: "Sardinha Atlântica",
        meta: "Packaging, identity",
        year: "2025",
        cats: ["packaging", "branding"],
        sector: "Tinned fish",
        image: sardinha,
        alt: "Orange and red steps climbing a wall against a deep blue sky",
        result: { value: "3.2×", label: "export orders in a year" },
        story: {
            quote: {
                text: "We used to compete on price. Now people buy a second tin to keep the first one company.",
                name: "Rita Fonseca",
                role: "Managing director, Sardinha Atlântica",
                image: client3
            }
        }
    },
    {
        title: "Nordvind",
        meta: "Identity, website",
        year: "2025",
        cats: ["branding", "web"],
        sector: "Wind energy",
        image: nordvind,
        alt: "Offshore wind turbines standing in a calm blue sea",
        result: { value: "+40%", label: "members in a year" },
        story: {
            quote: {
                text: "Our members finally understand what they own. Half of our new sign-ups say a friend sent them the homepage.",
                name: "Kari Haugen",
                role: "Chair, Nordvind",
                image: client2
            }
        }
    },
    {
        title: "Maré",
        meta: "Campaign, motion",
        year: "2026",
        cats: ["motion", "branding"],
        sector: "Swimwear",
        image: mare,
        alt: "A swimmer in goggles gliding through deep blue water",
        result: { value: "1.8M", label: "views of the launch film" },
        story: {
            quote: {
                text: "They said no beach, no sunsets, no slow-motion hair. I was nervous. Then we sold out in six weeks.",
                name: "Joana Pires",
                role: "Co-founder, Maré",
                image: client4
            }
        }
    },
    {
        title: "Kvist",
        meta: "Identity, website",
        year: "2024",
        cats: ["branding", "web"],
        sector: "Furniture",
        image: kvist,
        alt: "A red wooden cabin on a snowy shore below mountains at dusk",
        result: { value: "+73%", label: "orders through the new site" },
        story: {
            quote: {
                text: "People used to ask which gallery stocked us. Now they ask which tree their chair came from.",
                name: "Henrik Dahl",
                role: "Founder, Kvist",
                image: client6
            }
        }
    },
    {
        title: "Puls",
        meta: "Product design, motion",
        year: "2025",
        cats: ["web", "motion"],
        sector: "Health app",
        image: puls,
        alt: "A runner in silhouette against a huge glowing circle of light",
        result: { value: "2.4×", label: "30-day retention" },
        story: {
            quote: {
                text: "We asked them to make us more engaging. They made us quieter, and people stayed.",
                name: "Daniel Mensah",
                role: "Head of product, Puls",
                image: client5
            }
        }
    },
    {
        title: "Torra",
        meta: "Packaging, identity",
        year: "2024",
        cats: ["packaging", "branding"],
        sector: "Coffee roaster",
        image: torra,
        alt: "A soft abstract swirl of orange and white light",
        result: { value: "+90%", label: "wholesale accounts" },
        story: {
            quote: {
                text: "Cafés started printing our roast bar on their menus. That’s when we knew it worked.",
                name: "Miguel Teixeira",
                role: "Head roaster, Torra"
            }
        }
    },
    {
        title: "Ferja",
        meta: "Wayfinding, identity, app",
        year: "2026",
        cats: ["branding", "web"],
        sector: "Public transport",
        image: ferja,
        alt: "Trees and houses on the shore seen through a ferry’s oval window",
        result: { value: "−35%", label: "questions at the ticket desk" },
        story: {
            quote: {
                text: "The summer queue used to be a queue of questions. Now it’s just a queue.",
                name: "Lars Eriksen",
                role: "Head of customer experience, Ferja"
            }
        }
    },
];
