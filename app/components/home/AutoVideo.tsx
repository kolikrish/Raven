
"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import { useAfterLoad } from "../shared/useAfterLoad";

type AutoVideoProps = {
  src: string;
  poster: string;
  label: string;
  /** A WebVTT captions file; the reel has no speech, so it describes what's on screen */
  captions?: string;
};

const AutoVideo = ({ src, poster, label, captions }: AutoVideoProps) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  // The poster sits below the first screen, so it's attached once the page has loaded (or
  // the clip comes near) instead of competing with the hero's images while the page loads
  const posterReady = useAfterLoad(ref);

  useEffect(() => {
    if (posterReady && ref.current) ref.current.poster = poster;
  }, [posterReady, poster]);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (video.preload === "none") {
          video.preload = "auto";
          video.load();
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
      {captions && <track kind="captions" src={captions} srcLang="en" label="English" />}
    </video>
  );
};

export default AutoVideo;
