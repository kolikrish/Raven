
"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeUp, LineReveal, MaskReveal } from "../Animations/gsapAnim";
import UnderlineLink from "../Buttons/UnderlineLink";
import { FEATURED_POST, POSTS } from "../blog/posts";
import { ROUTES } from "../../routes";

// The latest three essays from the journal, as equal cards
const NOTES = [FEATURED_POST, ...POSTS].slice(0, 3);

const Journal = () => (
  <section id="journal" aria-label="From the journal" className="px-[5vw] py-[8%] max-lg:px-[6vw] max-lg:py-[12%] max-md:px-[7vw] max-md:py-[15%]">
    <div className="flex items-end justify-between gap-6 pb-[4vw] max-md:flex-col max-md:items-start max-md:pb-10">
      <div className="flex flex-col gap-4">
        <MaskReveal as="h2" className="leading-[0.95]">
          From the <span className="raven-accent">Journal</span>
        </MaskReveal>
        <LineReveal className="text-24 leading-[1.5] text-raven-muted">Notes from Oslo and Lisbon on the work, and how it gets made.</LineReveal>
      </div>
      <FadeUp>
        <UnderlineLink href={ROUTES.blog} persistent arrow className="font-raven-head text-24 font-medium text-raven-ink">
          Open the Journal
        </UnderlineLink>
      </FadeUp>
    </div>

    <ul className="grid grid-cols-3 gap-x-7 max-lg:gap-x-4 max-md:gap-x-2 gap-y-12 max-lg:grid-cols-2 max-md:grid-cols-1">
      {NOTES.map((post, index) => (
        <li key={post.title} className="flex h-full flex-col justify-between gap-5 max-lg:gap-3 max-md:gap-4">
          <Link href={ROUTES.blog} data-cursor="Read" className="group flex flex-col gap-4 max-lg:gap-2 max-md:gap-4">
            <FadeUp delay={index * 0.08} className="relative aspect-4/3 overflow-hidden rounded-lg max-lg:rounded-sm max-md:rounded-lg">
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(max-width: 767px) 90vw, (max-width: 1023px) 48vw, 32vw"
                quality={90}
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
            </FadeUp>
            <FadeUp delay={index * 0.08 + 0.1} className="flex items-center gap-3 text-14">
              <span className="rounded-full bg-(--raven-ink)/6 px-[0.9vw] py-[0.35vw] font-medium max-lg:px-3 max-lg:py-1.5">
                {post.category}
              </span>
              <time dateTime={post.dateTime} className="text-raven-muted">
                {post.date}
              </time>
            </FadeUp>
            <MaskReveal as="h3" delay={index * 0.08} className="text-30 font-semibold leading-[1.2] tracking-tight max-md:text-[5.6vw]!">
              {post.title}
            </MaskReveal>
          </Link>
          <FadeUp delay={index * 0.08 + 0.2}>
            <UnderlineLink href={ROUTES.blog} persistent arrow tabIndex={-1} className="font-raven-head text-24 font-medium text-raven-ink">
              Read Essay
            </UnderlineLink>
          </FadeUp>
        </li>
      ))}
    </ul>
  </section>
);

export default Journal;
