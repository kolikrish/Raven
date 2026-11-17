
"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import { ArrowUpRight } from "./icons";
import { titleCase } from "../../titleCase";

type UnderlineLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  persistent?: boolean;
  /** Arrow after the text (turns on hover) - for standalone link buttons. */
  arrow?: boolean;
  tabIndex?: number;
  external?: boolean;
};

const UnderlineLink = ({
  href,
  children: content,
  className = "",
  persistent = false,
  arrow = false,
  tabIndex,
  external = false,
}: UnderlineLinkProps) => {
  // Link labels follow the site's title case (emails and plain links are left alone)
  const children = typeof content === "string" ? titleCase(content) : content;
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const enter = () => {
    const line = lineRef.current;
    if (!line || prefersReducedMotion()) return;
    timelineRef.current?.kill();

    if (persistent) {
      timelineRef.current = gsap
        .timeline()
        .set(line, { transformOrigin: "100% 50%" })
        .to(line, { scaleX: 0, duration: 0.4, ease: "power3.in" })
        .set(line, { transformOrigin: "0% 50%" })
        .to(line, { scaleX: 1, duration: 0.5, ease: "power3.out" });
      return;
    }

    timelineRef.current = gsap
      .timeline()
      .set(line, { transformOrigin: "0% 50%" })
      .to(line, { scaleX: 1, duration: 0.6, ease: "power3.out" });
  };

  const leave = () => {
    const line = lineRef.current;
    if (!line || persistent || prefersReducedMotion()) return;
    timelineRef.current?.kill();
    timelineRef.current = gsap
      .timeline()
      .set(line, { transformOrigin: "100% 50%" })
      .to(line, { scaleX: 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={`group/underline relative inline-block w-fit py-[0.2vw] max-lg:py-[0.4vw] max-md:py-[0.8vw] ${className}`.trim()}
    >
      {arrow ? (
        <span className="inline-flex items-center gap-1.5 max-lg:gap-2 max-md:gap-1.5">
          {children}
          <ArrowUpRight className="size-[1vw] transition-transform duration-500 group-hover/underline:rotate-45 max-lg:size-[2.4vw] max-md:size-[3.9vw]" />
        </span>
      ) : (
        children
      )}
      <span
        ref={lineRef}
        aria-hidden
        className={`absolute bottom-1 left-0 h-px w-full bg-current ${persistent ? "" : "[transform:scaleX(0)]"}`}
      />
    </Link>
  );
};

export default UnderlineLink;
