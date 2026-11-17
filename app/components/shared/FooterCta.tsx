
import { FadeUp, LineReveal, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import Button from "../Buttons/Button";
import UnderlineLink from "../Buttons/UnderlineLink";
import { BRAND } from "../../brand";

// The studio's calendar for the next six months. Edit it as projects book up: "full" months
// are taken, "few" has room for one or two small projects, "open" takes new work.
type Slot = "full" | "few" | "open";
const AVAILABILITY: { month: string; year: string; slot: Slot }[] = [
  { month: "Dec", year: "2026", slot: "full" },
  { month: "Jan", year: "2027", slot: "full" },
  { month: "Feb", year: "2027", slot: "few" },
  { month: "Mar", year: "2027", slot: "open" },
  { month: "Apr", year: "2027", slot: "open" },
  { month: "May", year: "2027", slot: "open" },
];

const SLOT_LABEL: Record<Slot, string> = { full: "Full", few: "Few slots", open: "Open" };
const SLOT_FILL: Record<Slot, string> = {
  full: "h-full bg-(--raven-ink)/12",
  few: "h-1/2 bg-(--raven-accent)/45",
  open: "h-full bg-(--raven-accent)",
};

const firstOpen = AVAILABILITY.find((item) => item.slot === "open");

// The closing invitation on every page: a big line, then the studio's availability as six
// month bars, and how to get in touch.
const FooterCta = () => (
  <section aria-label="Start a project" className="px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[15%]">
    <div className="flex flex-col gap-11 max-lg:gap-6 max-md:gap-8">
      <RuleDraw className="h-px w-full bg-(--raven-ink)/15" />
      <div className="flex flex-col gap-14 max-lg:gap-12">
        <MaskReveal as="h2" className="raven-display">
          Got a Brief? <span className="raven-accent">Send It Over.</span>
        </MaskReveal>

        <div className="grid grid-cols-12 items-end gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 gap-y-12">
          <FadeUp className="col-span-7 flex flex-col gap-4 max-lg:col-span-12">
            <p className="flex flex-wrap items-baseline justify-between gap-2 text-14 font-medium">
              <span>Availability</span>
              {firstOpen && (
                <span className="text-raven-muted">
                  Booking new projects from {firstOpen.month} {firstOpen.year}
                </span>
              )}
            </p>
            <ol className="grid grid-cols-6 gap-2 max-md:grid-cols-3 max-md:gap-y-5">
              {AVAILABILITY.map((item) => (
                <li key={`${item.month}-${item.year}`} className="flex flex-col gap-2">
                  <span aria-hidden className="relative flex h-[8vh] items-end overflow-hidden rounded-lg bg-(--raven-ink)/5 max-lg:h-[6.9vh] max-md:h-[7.4vh]">
                    <span className={`w-full rounded-lg ${SLOT_FILL[item.slot]}`} />
                  </span>
                  <span className="flex flex-col text-14 leading-[1.4]">
                    <span className="font-medium">
                      {item.month}
                      <span className="sr-only"> {item.year}</span>
                    </span>
                    <span className={item.slot === "open" ? "text-(color:--raven-accent)" : "text-raven-muted"}>{SLOT_LABEL[item.slot]}</span>
                  </span>
                </li>
              ))}
            </ol>
          </FadeUp>

          <div className="col-span-4 col-start-9 flex flex-col items-start gap-6 max-lg:col-span-12 max-lg:col-start-1">
            <LineReveal delay={0.1} className="text-22 leading-[1.5] text-raven-muted">
              Send a few lines about the project and your launch date. A studio lead will reply by the next working day.
            </LineReveal>
            <FadeUp delay={0.2} className="flex flex-col items-start gap-6">
              <UnderlineLink href={`mailto:${BRAND.email}`} persistent className="font-raven-head text-30 font-medium text-raven-ink">
                {BRAND.email}
              </UnderlineLink>
              <Button label="Start a project" href={`mailto:${BRAND.email}`} tone="accent" icon />
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FooterCta;
