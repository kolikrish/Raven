
import type { StaticImageData } from "next/image";
import ingrid from "../../assets/pictures/about/team-ingrid.webp";
import tomas from "../../assets/pictures/about/team-tomas.webp";
import sofie from "../../assets/pictures/about/team-sofie.webp";
import beatriz from "../../assets/pictures/about/team-beatriz.webp";
import anders from "../../assets/pictures/about/team-anders.webp";
import ines from "../../assets/pictures/about/team-ines.webp";
import jonas from "../../assets/pictures/about/team-jonas.webp";
import marta from "../../assets/pictures/about/team-marta.webp";

// The studio's people. The About page, the founder in its hero and the Journal's authors
// all read from this list.
export type Member = {
  id: string;
  name: string;
  role: string;
  city: "Oslo" | "Lisbon";
  image: StaticImageData;
};

export const TEAM: Member[] = [
  { id: "ingrid", name: "Ingrid Solberg", role: "Founder and creative director", city: "Oslo", image: ingrid },
  { id: "tomas", name: "Tomás Aguiar", role: "Head of strategy", city: "Lisbon", image: tomas },
  { id: "sofie", name: "Sofie Parker", role: "Design director", city: "Oslo", image: sofie },
  { id: "beatriz", name: "Beatriz Matos", role: "Senior designer", city: "Lisbon", image: beatriz },
  { id: "anders", name: "Anders Holm", role: "Creative technologist", city: "Oslo", image: anders },
  { id: "ines", name: "Inês Carvalho", role: "Head of writing", city: "Lisbon", image: ines },
  { id: "jonas", name: "Jonas Berg", role: "Motion lead", city: "Oslo", image: jonas },
  { id: "marta", name: "Marta Reis", role: "Producer", city: "Lisbon", image: marta },
];

export const FOUNDER = TEAM[0];
