"use client";

import { useRef, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MediaReveal } from "../../Animations/gsapAnim";
import ClipReveal from "../clip-reveal";
import { prefersReducedMotion } from "../../Animations/reducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ParallaxImageProps = {
  image: StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Open the frame with the site's clip reveal instead of the default fade */
  reveal?: boolean;
  hoverZoom?: boolean;
  travel?: number;
  scale?: number;
  start?: string;
  end?: string;
  // Rendered inside the reveal, so overlays open with the image
  children?: ReactNode;
};

const ParallaxImage = ({
  image,
  alt,
  className = "",
  sizes = "(max-width: 767px) 90vw, 90vw",
  priority = false,
  reveal = false,
  hoverZoom = false,
  travel = 7,
  scale = 1.2,
  start = "top bottom",
  end = "bottom top",
  children,
}: ParallaxImageProps) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const moveRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<HTMLDivElement | null>(null);

  const zoom = (active: boolean) => {
    if (!hoverZoom) return;
    gsap.to(zoomRef.current, {
      scale: active ? 1.06 : 1,
      duration: prefersReducedMotion() ? 0 : 1.2,
      ease: "power3.out",
    });
  };

  useGSAP(
    () => {
      const move = moveRef.current;
      if (!move || prefersReducedMotion()) return;

      gsap.fromTo(
        move,
        { yPercent: -travel, scale },
        {
          yPercent: travel,
          scale,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: wrapRef, dependencies: [travel, scale, start, end] },
  );

  return (
    <div
      ref={wrapRef}
      onMouseEnter={() => zoom(true)}
      onMouseLeave={() => zoom(false)}
      className={`relative w-full overflow-hidden ${reveal ? "" : "bg-raven-surface"} ${className}`.trim()}
    >
      <div ref={zoomRef} className="h-full w-full">
      {reveal ? (
        <ClipReveal className="h-full w-full">
        <div ref={moveRef} className="h-full w-full will-change-transform">
          <Image
            quality={95}
            src={image}
            alt={alt}
            sizes={sizes}
            priority={priority}
            className="h-full w-full object-cover"
          />
        </div>
        {children}
        </ClipReveal>
      ) : (
      <MediaReveal zoom={false} className="h-full w-full">
        <div ref={moveRef} className="h-full w-full will-change-transform">
          <Image
            quality={95}
            src={image}
            alt={alt}
            sizes={sizes}
            priority={priority}
            className="h-full w-full object-cover"
          />
        </div>
        {children}
      </MediaReveal>
      )}
      </div>
    </div>
  );
};

export default ParallaxImage;
