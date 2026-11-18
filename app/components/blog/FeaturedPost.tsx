
import Image from "next/image";
import { FadeUp, LineReveal, MaskReveal } from "../Animations/gsapAnim";
import ClipReveal from "../effects/clip-reveal";
import { BRAND } from "../../brand";
import { CARD, CHIP, MEDIA } from "./cardStyles";
import { FEATURED_POST } from "./posts";

// The latest essay as one wide card: the photo on the left, the text on the right
const FeaturedPost = () => {
  const post = FEATURED_POST;
  return (
    <div>
      <div className={`group flex gap-[3vw] max-lg:flex-col max-lg:gap-0 ${CARD}`}>
        <div className={`relative aspect-[4/3.4] w-[47%] shrink-0 max-lg:aspect-video max-lg:w-full ${MEDIA}`}>
          <div className="h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 motion-reduce:transition-none">
            <ClipReveal start="top 85%" className="h-full w-full">
              <Image
                quality={95}
                src={post.image}
                alt={post.alt}
                priority
                sizes="(max-width: 1023px) 90vw, 45vw"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-10 py-[2vw] pr-[2.4vw] max-lg:px-[3vw] max-lg:pb-[4vw] max-lg:pt-[2vw] max-md:px-[4vw] max-md:pb-[7vw]">
          <div className="flex flex-col items-start gap-6 max-lg:gap-4">
            <FadeUp as="span" className={`${CHIP} bg-(--raven-ink)/6`}>
              {post.category}
            </FadeUp>
            <MaskReveal as="h2" className="text-40 tracking-normal!">
              {post.title}
            </MaskReveal>
            <LineReveal className="w-[90%] text-24 leading-[1.4] text-raven-muted max-lg:w-full">{post.excerpt}</LineReveal>
          </div>
          <div className="flex items-end justify-between gap-6">
            <FadeUp delay={0.2} className="flex items-center gap-4 text-14 font-medium">
              <time dateTime={post.dateTime} className="text-raven-muted">
                {post.date}
              </time>
            </FadeUp>
            <FadeUp as="span" delay={0.3} className="font-raven-serif text-30 leading-none">
              by {BRAND.name}
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
