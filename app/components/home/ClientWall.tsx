
import Link from "next/link";
import { FadeUp, LineReveal, MaskReveal, RuleDraw } from "../Animations/gsapAnim";
import { ArrowUpRight } from "../Buttons/icons";
import { PROJECTS } from "../work/projects";
import { ROUTES } from "../../routes";

// Every client in a hairline grid. Hovering a cell fills it with blue from the bottom and
// swaps the name for what changed after the project; on touch screens the result sits under
// the name instead. Each cell leads to the Work page.
const ClientWall = () => (
  <section id="clients" aria-labelledby="clients-title" className="px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[15%]">
    <div className="mb-[2.4vw] flex items-end justify-between gap-6 max-lg:mb-8 max-md:flex-col max-md:items-start">
      <MaskReveal as="h2" id="clients-title" className="text-64! leading-none">
        Recent <span className="raven-accent">Clients</span>
      </MaskReveal>
      <LineReveal className="w-[26vw] text-22 leading-[1.45] text-raven-muted max-lg:w-[50vw] max-md:w-full">
        Eight brands from the last three years, and the number each one cared about most.
      </LineReveal>
    </div>

    <div className="relative">
      <RuleDraw syncWithFade className="absolute inset-x-0 top-0 z-1 h-px bg-(--raven-ink)/12" />
      <RuleDraw syncWithFade vertical className="absolute inset-y-0 left-0 z-1 w-px bg-(--raven-ink)/12" />
      <FadeUp as="ul" className="grid grid-cols-4 max-lg:grid-cols-2">
        {PROJECTS.map((project, index) => (
          <li key={project.title} className="relative">
            <RuleDraw syncWithFade delay={(index % 4) * 0.06} className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-px bg-(--raven-ink)/12" />
            <RuleDraw syncWithFade vertical delay={(index % 4) * 0.06} className="pointer-events-none absolute inset-y-0 right-0 z-1 w-px bg-(--raven-ink)/12" />
            <Link
              href={ROUTES.work}
              data-cursor-quiet
              className="group relative flex h-[13vw] flex-col justify-between overflow-hidden p-[1.4vw] max-lg:h-[30vw] max-lg:p-5 max-md:h-[44vw] max-md:p-4"
            >
              {/* The blue layer rises from the bottom edge on hover */}
              <span
                aria-hidden
                className="absolute inset-0 bg-(--raven-accent) [clip-path:inset(100%_0%_0%_0%)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[clip-path:inset(0%_0%_0%_0%)] motion-reduce:transition-none"
              />

              <span className="relative flex items-start justify-between gap-3 text-14 text-(color:--raven-muted) transition-colors duration-500 group-hover:text-(color:--raven-white)/80">
                <span>{project.sector}</span>
                <ArrowUpRight className="size-[0.9vw] shrink-0 transition-transform duration-500 group-hover:rotate-45 max-lg:size-4" />
              </span>

              {/* At rest: the client's name. On hover it fades up and away first, then the result
                  rises into the same spot from below a mask, so the two never overlap. Leaving
                  reverses the order. */}
              <span className="relative grid items-end overflow-hidden pb-[0.1em]">
                <span className="col-start-1 row-start-1 flex flex-col gap-1 transition-[translate,opacity] delay-200 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:group-hover:-translate-y-3 lg:group-hover:opacity-0 lg:group-hover:delay-0 lg:group-hover:duration-300">
                  <span className="font-raven-head text-30 font-medium leading-[1.05] tracking-tight">{project.title}</span>
                  {/* Touch screens have no hover, so the result is shown under the name */}
                  <span aria-hidden className="text-14 text-raven-muted lg:hidden">
                    <span className="font-medium text-(color:--raven-accent)">{project.result.value}</span> {project.result.label}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="col-start-1 row-start-1 flex translate-y-[110%] flex-col gap-1 text-(color:--raven-white) transition-[translate] delay-0 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:delay-200 group-hover:duration-700 motion-reduce:transition-none max-lg:hidden"
                >
                  <span className="font-raven-head text-40 font-medium leading-none tracking-tight">{project.result.value}</span>
                  <span className="text-14 text-(color:--raven-white)/80">{project.result.label}</span>
                </span>
              </span>
              <span className="sr-only">
                , {project.result.value} {project.result.label}. See the Work page.
              </span>
            </Link>
          </li>
        ))}
      </FadeUp>
    </div>
  </section>
);

export default ClientWall;
