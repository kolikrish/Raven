
"use client";

import { useRef, useState } from "react";
import { FadeUp } from "../Animations/gsapAnim";
import Button from "../Buttons/Button";
import UnderlineLink from "../Buttons/UnderlineLink";
import { Check } from "../Buttons/icons";
import { BRAND } from "../../brand";
import { ENGAGEMENTS, SERVICES, type Engagement } from "./services";
import { useAfterLoad } from "../shared/useAfterLoad";

// Each row is a discipline, the track runs week by week, and a bar shows when that discipline runs,
// with the service's image sliced across them.
const MIN_WEEKS = 16;

type Row = { id: string; start: number; length: number };

const schedule = (selected: string[], mode: Engagement) => {
  // SERVICES is already in dependency order, so each discipline can start after
  // whichever of its predecessors were picked
  const picked = SERVICES.filter((service) => selected.includes(service.id));
  const ends: Record<string, number> = {};
  const rows: Row[] = picked.map((service, index) => {
    if (mode === "sprint") return { id: service.id, start: index * 2, length: 2 };
    const deps = service.brief.after.filter((id) => id in ends);
    const start = deps.length
      ? Math.max(0, Math.max(...deps.map((id) => ends[id])) - (service.brief.overlap ?? 0))
      : 0;
    ends[service.id] = start + service.brief.weeks;
    return { id: service.id, start, length: service.brief.weeks };
  });
  const weeks = rows.reduce((total, row) => Math.max(total, row.start + row.length), 0);
  const people = picked.reduce(
    (total, service) => (mode === "sprint" ? Math.max(total, service.brief.people) : total + service.brief.people),
    0,
  );
  return { rows, weeks, people: picked.length ? people + 1 : 0, count: picked.length };
};

const BriefBuilder = () => {
  const [selected, setSelected] = useState(["strategy", "identity"]);
  const [mode, setMode] = useState<Engagement>("project");
  // The bars show full-size photos as backgrounds. They're attached once the page has loaded
  // (or the builder comes near), so they don't hold up the first screen.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const photosReady = useAfterLoad(rootRef);
  const plan = schedule(selected, mode);
  const columns = Math.max(MIN_WEEKS, plan.weeks);
  const engagement = ENGAGEMENTS.find((item) => item.value === mode)!;

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const timeline =
    plan.count === 0
      ? { value: "0 weeks", note: "Pick at least one discipline" }
      : mode === "retainer"
        ? { value: "Ongoing", note: "Three-month minimum, then month to month" }
        : mode === "sprint"
          ? { value: `${plan.weeks} weeks`, note: `${plan.count} back-to-back ${plan.count === 1 ? "sprint" : "sprints"}` }
          : { value: `${plan.weeks} weeks`, note: "From kick-off to launch" };

  const forms = SERVICES.filter((service) => selected.includes(service.id)).map((service) => service.brief.form);
  const query = new URLSearchParams({
    ...(forms.length ? { services: forms.join(",") } : {}),
    engagement: engagement.name,
    ...(plan.count && mode !== "retainer" ? { weeks: String(plan.weeks) } : {}),
  });

  return (
    <div ref={rootRef} className="grid grid-cols-12 gap-x-9 gap-y-10 rounded-lg border border-(--raven-ink)/10 bg-(--raven-white) p-[2vw] max-lg:gap-x-0 max-lg:p-[4vw] max-md:p-[6vw]">
      <FadeUp className="col-span-4 flex flex-col justify-between gap-10 max-lg:col-span-12">
        <div className="flex flex-col gap-8">
          <div role="group" aria-label="How you want to work" className="flex flex-wrap gap-2 max-lg:gap-3">
            {ENGAGEMENTS.map((item) => {
              const active = item.value === mode;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMode(item.value)}
                  className={`font-raven-head flex h-[5vh] items-center rounded-full border px-[1.2vw] text-22 transition-colors duration-300 max-lg:h-[3.6vh] max-lg:px-[2.4vw] max-md:h-[5.8vh] max-md:px-[4vw] ${
                    active
                      ? "border-(--raven-ink) bg-(--raven-ink) text-(color:--raven-paper)"
                      : "border-(--raven-ink)/30 text-(color:--raven-ink) hover:border-(--raven-ink)"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-14 text-raven-muted">{engagement.tag}</span>
            <p className="text-24 leading-[1.3]">{engagement.text}</p>
            <p className="flex flex-col gap-1 text-24 leading-[1.3]">
              <span className="text-14 text-raven-muted">Best for</span>
              {engagement.best}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <dl aria-live="polite" className="grid grid-cols-2 gap-4 max-lg:gap-3">
            <div className="flex flex-col gap-2 rounded-lg bg-raven-surface p-[1.2vw] max-lg:p-[3vw] max-md:p-[4vw]">
              <dt className="text-14 text-raven-muted">Timeline</dt>
              <dd className="font-raven-head text-40 leading-none">{timeline.value}</dd>
              <dd className="text-14 text-raven-muted">{timeline.note}</dd>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-raven-surface p-[1.2vw] max-lg:p-[3vw] max-md:p-[4vw]">
              <dt className="text-14 text-raven-muted">Team</dt>
              <dd className="font-raven-head text-40 leading-none">{plan.count ? plan.people : "0"}</dd>
              <dd className="text-14 text-raven-muted">
                {plan.count ? "People, including your producer" : "Grows with the brief"}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button label="Send this brief" href={`mailto:${BRAND.email}?subject=${encodeURIComponent("Project brief")}&body=${encodeURIComponent(query.toString())}`} icon />
            <UnderlineLink href={`mailto:${BRAND.email}`} persistent arrow className="font-raven-head text-22 font-medium">
              Not sure yet
            </UnderlineLink>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1} className="col-span-8 flex flex-col gap-2 max-lg:gap-3 max-lg:col-span-12">
        <div className="grid grid-cols-[13vw_1fr] items-end gap-x-5 max-lg:gap-x-3 max-md:gap-x-1 py-[0.2vw] text-14 text-raven-muted max-lg:hidden">
          <span>{plan.count} of {SERVICES.length} picked</span>
          <span className="flex justify-between">
            <span>{mode === "retainer" ? "Every week" : "Week 1"}</span>
            <span>{mode === "retainer" ? "and onwards" : `Week ${columns}`}</span>
          </span>
        </div>
        {SERVICES.map((service) => {
          const row = plan.rows.find((item) => item.id === service.id);
          const on = Boolean(row);
          // A retainer keeps every picked discipline running all the way across
          const start = mode === "retainer" ? 0 : (row?.start ?? 0);
          const length = mode === "retainer" ? columns : (row?.length ?? 0);
          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(service.id)}
              aria-label={`${service.title}${on && mode !== "retainer" ? `, weeks ${start + 1} to ${start + length}` : ""}`}
              className="group grid grid-cols-[13vw_1fr] items-center gap-x-5 max-lg:gap-x-3 max-md:gap-x-1 rounded-md text-left outline-offset-4 outline-(--raven-accent) focus-visible:outline-2 max-lg:grid-cols-1 max-lg:gap-y-2"
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`flex size-[1.1vw] shrink-0 items-center justify-center rounded-xs max-md:rounded-sm border transition-colors duration-300 max-lg:size-[2.6vw] max-md:size-[4.4vw] ${
                    on
                      ? "border-(--raven-accent) bg-(--raven-accent) text-(color:--raven-white)"
                      : "border-(--raven-ink)/30 group-hover:border-(--raven-ink)"
                  }`}
                >
                  {on && <Check className="size-[70%]" />}
                </span>
                <span
                  className={`text-22 transition-colors duration-300 ${
                    on ? "text-(color:--raven-ink)" : "text-(color:--raven-muted) group-hover:text-(color:--raven-ink)"
                  }`}
                >
                  {service.title}
                </span>
              </span>
              {/* The weeks as one track with faint week marks; the bar covers the weeks this
                  discipline runs and shows its photo */}
              <span
                aria-hidden
                className="relative h-[3.5vh] overflow-hidden rounded-full bg-(--raven-ink)/6 transition-colors duration-300 group-hover:bg-(--raven-ink)/10 max-md:h-[6.4vh] max-md:rounded-lg"
              >
                <span className="absolute inset-0 flex">
                  {Array.from({ length: columns }, (_, week) => (
                    <span key={week} className="flex-1 border-r border-(--raven-ink)/7" />
                  ))}
                </span>
                <span
                  className={`absolute inset-y-0 overflow-hidden rounded-full bg-cover bg-center max-md:rounded-lg transition-[left,width,opacity] duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] motion-reduce:transition-none ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    left: `${(start / columns) * 100}%`,
                    width: on ? `${(length / columns) * 100}%` : "0%",
                    backgroundImage: photosReady ? `url(${service.image.src})` : undefined,
                  }}
                />
              </span>
            </button>
          );
        })}
      </FadeUp>
    </div>
  );
};

export default BriefBuilder;
