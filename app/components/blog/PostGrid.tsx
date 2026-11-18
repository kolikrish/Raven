
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { FadeUp, LineReveal, MaskReveal } from "../Animations/gsapAnim";
import { prefersReducedMotion } from "../Animations/reducedMotion";
import Button from "../Buttons/Button";
import ClipReveal from "../effects/clip-reveal";
import { CARD, CHIP, MEDIA } from "./cardStyles";
import FilterBar from "../shared/FilterBar";
import { POSTS, type Post } from "./posts";

// A post as a white card: photo on top, category pinned to its corner. Each card is keyed by
// its post (and the grid by its filter), so its text never changes after the split.
export const PostCard = ({ post, index = 0 }: { post: Post; index?: number }) => {
  const delay = (index % 3) * 0.1;

  return (
    <div className="h-full">
      <div data-journal-card tabIndex={-1} className={`group flex h-full flex-col ${CARD}`}>
        <div className={`relative aspect-[4/3] ${MEDIA}`}>
          <div className="h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 motion-reduce:transition-none">
            <ClipReveal start="top 85%" className="h-full w-full">
              <Image
                quality={95}
                src={post.image}
                alt={post.alt}
                sizes="(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 30vw"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
          </div>
          <FadeUp
            as="span"
            delay={delay + 0.2}
            className={`${CHIP} absolute right-[0.8vw] top-[0.8vw] bg-(--raven-white)/90 backdrop-blur-sm max-lg:right-3 max-lg:top-3`}
          >
            {post.category}
          </FadeUp>
        </div>
        <div className="flex flex-1 flex-col gap-3 px-[1vw] pb-[1.2vw] pt-[0.6vw] max-lg:px-[2vw] max-lg:pb-[2.4vw] max-md:px-[4vw] max-md:pb-[5vw]">
          <MaskReveal as="h3" delay={delay} className="text-28 font-medium">
            {post.title}
          </MaskReveal>
          <LineReveal delay={delay} className="text-22 leading-[1.4] text-raven-muted">
            {post.excerpt}
          </LineReveal>
          <FadeUp as="time" delay={delay + 0.2} dateTime={post.dateTime} className="mt-auto pt-3 text-14 text-raven-muted">
            {post.date}
          </FadeUp>
        </div>
      </div>
    </div>
  );
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "branding", label: "Branding" },
  { value: "design", label: "Design" },
  { value: "process", label: "Process" },
  { value: "studio", label: "Studio" },
];

const VISIBLE = 6;

const PostGrid = () => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const pool = POSTS.filter((post) => filter === "all" || post.category.toLowerCase() === filter);
  const changeFilter = (value: string) => {
    if (value === filter) return;
    const cards = gridRef.current ? Array.from(gridRef.current.children) : [];
    if (prefersReducedMotion() || !cards.length) {
      setFilter(value);
      return;
    }
    gsap.to(cards, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setFilter(value),
    });
  };

  const showOlder = () => {
    setExpanded(true);
    requestAnimationFrame(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-journal-card]");
      cards?.[VISIBLE]?.focus({ preventScroll: true });
    });
  };

  const collapsed = filter === "all" && !expanded;
  const shown = collapsed ? pool.slice(0, VISIBLE) : pool;

  return (
    <div className="flex flex-col gap-18 max-lg:gap-12">
      <div className="flex flex-col gap-16 max-lg:gap-10">
        <FilterBar
          label="Filter the journal by subject"
          options={FILTERS}
          value={filter}
          onChange={changeFilter}
          countText={`${shown.length} ${shown.length === 1 ? "entry" : "entries"}`}
        />
        <div ref={gridRef} key={filter} className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1">
          {shown.map((post, index) => (
            <PostCard key={post.title} post={post} index={index} />
          ))}
        </div>
      </div>
      {collapsed && pool.length > VISIBLE && (
        <FadeUp className="flex justify-center">
          <Button label="Show Earlier Entries" variant="outline" onClick={showOlder} />
        </FadeUp>
      )}
    </div>
  );
};

export default PostGrid;
