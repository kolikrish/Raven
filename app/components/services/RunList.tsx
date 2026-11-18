
"use client";

import { useState } from "react";
import { FadeUp, LineReveal, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import SquareTranslate from "../effects/square-translate";

type Run = { title: string; text: string; time: string; on: number[] };

const RunList = ({ runs }: { runs: Run[] }) => {
  const [active, setActive] = useState(-1);

  return (
    <SquareTranslate onActiveChange={setActive}>
      <ol className="flex flex-col">
        {runs.map((run, index) => {
          const lit = active === index;
          return (
            <li key={run.title} data-row className="relative">
              <RuleDraw syncWithFade className="absolute inset-x-0 top-0 h-px bg-(--raven-ink)/10" />
              {index === runs.length - 1 && (
                <RuleDraw syncWithFade className="absolute inset-x-0 bottom-0 h-px bg-(--raven-ink)/10" />
              )}
              <div className="group grid grid-cols-12 items-center gap-x-9 gap-y-3 max-lg:gap-x-0 py-[3vw] max-lg:items-start max-lg:py-[5vw] max-md:py-[8vw]">
                <span
                  data-shift
                  className="col-span-1 self-start py-[0.5vw] text-14 text-raven-muted max-lg:col-span-2"
                >
                  {/* data-shift elements are moved by SquareTranslate, so the reveal sits on an inner span */}
                  <FadeUp as="span" className="block">
                    {String(index + 1).padStart(2, "0")}
                  </FadeUp>
                </span>
                <MaskReveal
                  as="h3"
                  data-shift
                  className={`col-span-4 text-40 transition-colors duration-700 ease-out group-hover:text-(color:--raven-accent) max-lg:col-span-10 motion-reduce:transition-none ${
                    lit
                      ? "text-(color:--raven-accent)"
                      : "text-raven-muted max-lg:text-(color:--raven-ink)"
                  }`}
                >
                  {run.title}
                </MaskReveal>
                <LineReveal delay={0.1} className="col-span-4 col-start-6 text-24 leading-[1.3] text-raven-muted max-lg:col-span-10 max-lg:col-start-3">
                  {run.text}
                </LineReveal>
                <FadeUp delay={0.2} className="col-span-3 col-start-10 flex flex-col items-end gap-3 max-lg:col-span-10 max-lg:col-start-3 max-lg:items-start">
                  <span className="whitespace-nowrap text-14 text-(color:--raven-ink)">
                    {run.time}
                  </span>
                  {/* Twelve weeks as one track; the bar covers this phase's weeks */}
                  <span aria-hidden className="relative h-1.5 w-[14vw] rounded-full bg-(--raven-ink)/8 max-lg:h-2 max-lg:w-[30vw] max-md:w-full">
                    <span
                      className={`absolute inset-y-0 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                        lit ? "bg-(--raven-ink)" : "bg-(--raven-ink)/30 group-hover:bg-(--raven-ink)"
                      }`}
                      style={{ left: `${(run.on[0] / 12) * 100}%`, width: `${(run.on.length / 12) * 100}%` }}
                    />
                  </span>
                </FadeUp>
              </div>
            </li>
          );
        })}
      </ol>
    </SquareTranslate>
  );
};

export default RunList;
