
import type { ReactNode } from "react";
import { FadeUp, MaskReveal, LineReveal } from "../Animations/gsapAnim";
import { PAGE_DELAY } from "../Animations/timing";
import Breadcrumb, { type Crumb } from "./Breadcrumb";

type PageHeroProps = {
  crumbs: Crumb[];
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
  titleClassName?: string;
  textClassName?: string;
  containerClassName?: string;
};

const PageHero = ({
  crumbs,
  title,
  text,
  children,
  titleClassName = "w-full",
  textClassName = "w-[48%]",
  containerClassName = "",
}: PageHeroProps) => (
  <section
    className={`${containerClassName} flex h-[83vh] flex-col justify-center gap-11 px-[5vw] py-[8vh] max-lg:h-auto max-lg:gap-8 max-lg:px-[6vw] max-lg:pb-[4vh] max-lg:pt-[10vh] max-md:gap-9 max-md:px-[7vw] max-md:pb-[4vh] max-md:pt-[14vh]`}
  >
    <Breadcrumb crumbs={crumbs} />
    <div className="flex flex-col gap-8">
      <MaskReveal as="h1" delay={PAGE_DELAY} className={titleClassName}>
        {title}
      </MaskReveal>
      {(text || children) && (
        <div
          className={`flex flex-col gap-6 self-end max-lg:w-[70%] max-lg:self-start max-md:w-full ${textClassName}`}
        >
          {text && (
            <LineReveal
              delay={PAGE_DELAY + 0.3}
              className="text-28 text-raven-muted"
            >
              {text}
            </LineReveal>
          )}
          {children && <FadeUp delay={PAGE_DELAY + 0.4}>{children}</FadeUp>}
        </div>
      )}
    </div>
  </section>
);

export default PageHero;
