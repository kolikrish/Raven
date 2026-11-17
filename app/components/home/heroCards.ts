
import cardA from "../../assets/pictures/work/work-fjellform.webp";
import cardB from "../../assets/pictures/work/work-mare.webp";
import cardC from "../../assets/pictures/work/work-puls.webp";
import cardD from "../../assets/pictures/work/work-sardinha.webp";

export const HERO_CARDS = [
  { image: cardA, alt: "A hiker in a bright yellow hood against a hazy mountain range" },
  { image: cardB, alt: "A swimmer in goggles gliding through deep blue water" },
  { image: cardC, alt: "A runner in silhouette against a huge glowing circle of light" },
  { image: cardD, alt: "Orange and red steps climbing a wall against a deep blue sky" },
];

// Phones: the card is at most 54vw wide (4:5), and the widest photo (3:2) covers it at 1.875x
// its width, so it never draws wider than ~101vw. Asking for 150vw there only fetched a bigger file.
export const HERO_CARD_SIZES = "(max-width: 767px) 102vw, 60vw";
