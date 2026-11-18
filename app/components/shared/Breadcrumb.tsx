
import Link from "next/link";
import { FadeUp } from "../Animations/gsapAnim";
import { PAGE_DELAY } from "../Animations/timing";

export type Crumb = { label: string; href?: string };

const MAX_LABEL = 20;

const shorten = (label: string) =>
  label.length > MAX_LABEL ? `${label.slice(0, MAX_LABEL).trimEnd()}…` : label;

const Breadcrumb = ({ crumbs }: { crumbs: Crumb[] }) => (
  <FadeUp as="nav" delay={PAGE_DELAY} aria-label="Breadcrumb" className="py-[0.5vh] max-lg:py-[1vh]">
    <ol className="flex flex-wrap items-center gap-2 text-14 text-raven-muted">
      {crumbs.map((crumb, index) => (
        <li key={crumb.label} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden className="opacity-50">
              /
            </span>
          )}
          {crumb.href ? (
            <Link href={crumb.href} title={crumb.label} className="relative transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-3 after:content-[''] hover:text-(color:--raven-ink)">
              {shorten(crumb.label)}
            </Link>
          ) : (
            <span aria-current="page" title={crumb.label} className="text-(color:--raven-ink)">
              {shorten(crumb.label)}
            </span>
          )}
        </li>
      ))}
    </ol>
  </FadeUp>
);

export default Breadcrumb;
