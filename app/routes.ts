import { BRAND } from "./brand";

export const BASE = "";

export const ROUTES = {
  home: BASE || "/",
  work: `${BASE}/work`,
  services: `${BASE}/services`,
  about: `${BASE}/about`,
  team: `${BASE}/about#team`,
  blog: `${BASE}/blog`,
  contact: `mailto:${BRAND.email}`,
};

// The main pages: the header's pill on desktop, the menu on tablets and phones
export const NAV_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "Work", href: ROUTES.work },
  { label: "Services", href: ROUTES.services },
  { label: "About", href: ROUTES.about },
  { label: "Journal", href: ROUTES.blog },
];

