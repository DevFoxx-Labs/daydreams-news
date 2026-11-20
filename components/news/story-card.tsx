import Link from "next/link";

import {
  CategoryLabel,
  SponsoredLabel,
  TimeAgo,
} from "@/components/news/primitives";
import {
  Duration,
  ImageLiveBadge,
  PhotoCount,
  PlayBadge,
  StoryImage,
} from "@/components/news/story-image";
import type { Story } from "@/lib/data/types";
import { storyHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * StoryCard variants — DESIGN.md §3.
 *
 * `hero` · `stack` · `row` (text left, thumb right) · `row-left` (thumb left)
 * · `numbered` · `text` · `video-row`.
 *
 * Every variant: category label, headline, time-ago, image. Headlines clamp so
 * card heights stay predictable (DESIGN.md §8).
 */

type BaseProps = {
  story: Story;
  className?: string;
  /** Hero image of the page — the only one allowed `priority`. */
  priority?: boolean;
  showTime?: boolean;
  showDeck?: boolean;
};

function Overlays({ story }: { story: Story }) {
  return (
    <>
      {story.isLive ? <ImageLiveBadge /> : null}
      {story.type === "video" ? <PlayBadge /> : null}
      {story.videoDuration ? <Duration value={story.videoDuration} /> : null}
      {story.photoCount ? <PhotoCount count={story.photoCount} /> : null}
    </>
  );
}

/** Lead story with a gradient overlay — homepage centre column. */
export function HeroCard({ story, className, priority = true }: BaseProps) {
  return (
    <article className={cn("relative", className)}>
      <Link href={storyHref(story)} className="group block">
        <StoryImage
          media={story.image}
          seed={`hero-${story.id}`}
          priority={priority}
          sizes="(max-width: 1023px) 100vw, 620px"
          rounded="rounded-none lg:rounded-[6px]"
          className="h-[220px] md:h-[320px] lg:h-[420px]"
        >
          {story.isLive ? <ImageLiveBadge className="left-4 top-4" /> : null}
          {/* Text sits inside the image on ≥ lg, below it on mobile (§5.1). */}
          <div className="absolute inset-x-0 bottom-0 z-2 hidden bg-gradient-to-t from-black/85 to-transparent px-6 pb-5 pt-[90px] text-white lg:block">
            <CategoryLabel
              name={story.subCategory?.name ?? story.category.name}
              asLink={false}
              className="!text-[#ffd0d6]"
            />
            <h2 className="t-hero clamp-3 text-white">{story.title}</h2>
            {story.deck ? (
              <p className="clamp-2 mt-2 text-[16px] leading-[1.5] text-[#e8e8e8]">
                {story.deck}
              </p>
            ) : null}
          </div>
        </StoryImage>
        <div className="border-b-8 border-soft px-4 pb-3.5 pt-3 lg:hidden">
          {story.isSponsored ? <SponsoredLabel className="mb-1.5" /> : null}
          <CategoryLabel
            name={story.subCategory?.name ?? story.category.name}
            asLink={false}
          />
          <h2 className="t-hero clamp-3">{story.title}</h2>
          <TimeAgo value={story.publishedAt} className="mt-1.5 block" />
        </div>
      </Link>
    </article>
  );
}

/** Image on top, then category, headline and time. */
export function StackCard({
  story,
  className,
  imageClassName = "h-[150px]",
  showTime = false,
  showDeck = false,
  headingClassName = "t-h-md",
  priority = false,
}: BaseProps & { imageClassName?: string; headingClassName?: string }) {
  return (
    <article className={className}>
      <Link href={storyHref(story)} className="group block">
        <StoryImage
          media={story.image}
          seed={`stack-${story.id}`}
          priority={priority}
          className={cn("mb-2.5", imageClassName)}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 300px"
        >
          <Overlays story={story} />
        </StoryImage>
        {story.isSponsored ? <SponsoredLabel className="mb-1.5" /> : null}
        <CategoryLabel
          name={story.subCategory?.name ?? story.category.name}
          asLink={false}
        />
        <h3 className={cn("clamp-3 group-hover:text-brand-dark", headingClassName)}>
          {story.title}
        </h3>
        {showDeck && story.deck ? (
          <p className="clamp-2 mt-2 text-[16px] leading-[1.55] text-ink-2">
            {story.deck}
          </p>
        ) : null}
        {showTime ? <TimeAgo value={story.publishedAt} className="mt-1.5 block" /> : null}
      </Link>
    </article>
  );
}

/** Section lead: big image, 25px headline, deck and time. */
export function LeadCard({ story, className, priority = false }: BaseProps) {
  return (
    <article className={className}>
      <Link href={storyHref(story)} className="group block">
        <StoryImage
          media={story.image}
          seed={`lead-${story.id}`}
          priority={priority}
          className="mb-3 h-[200px] md:h-[240px] lg:h-[280px]"
          sizes="(max-width: 1023px) 100vw, 520px"
        >
          <Overlays story={story} />
        </StoryImage>
        {story.isSponsored ? <SponsoredLabel className="mb-1.5" /> : null}
        <CategoryLabel
          name={story.subCategory?.name ?? story.category.name}
          asLink={false}
        />
        <h3 className="t-h-lg clamp-3 group-hover:text-brand-dark">{story.title}</h3>
        {story.deck ? (
          <p className="clamp-3 mt-2 text-[16px] leading-[1.55] text-ink-2">
            {story.deck}
          </p>
        ) : null}
        <TimeAgo value={story.publishedAt} className="mt-2 block" />
      </Link>
    </article>
  );
}

/** Text left, thumbnail right — top-news list and mobile feed. */
export function RowCard({
  story,
  className,
  showTime = false,
  last = false,
}: BaseProps & { last?: boolean }) {
  return (
    <article
      className={cn(
        "grid grid-cols-[1fr_104px] gap-3 py-3 lg:grid-cols-[1fr_96px]",
        last ? "" : "border-b border-line",
        className,
      )}
    >
      <Link href={storyHref(story)} className="group contents">
        <div>
          {story.isSponsored ? <SponsoredLabel className="mb-1" /> : null}
          <CategoryLabel
            name={story.subCategory?.name ?? story.category.name}
            asLink={false}
          />
          <h3 className="t-h-sm clamp-3 group-hover:text-brand-dark">{story.title}</h3>
          {showTime ? (
            <TimeAgo value={story.publishedAt} className="mt-1 block" />
          ) : null}
        </div>
        <StoryImage
          media={story.image}
          seed={`row-${story.id}`}
          className="h-[70px] self-start lg:h-[64px]"
          rounded="rounded-[4px]"
          sizes="104px"
        >
          <Overlays story={story} />
        </StoryImage>
      </Link>
    </article>
  );
}

/** Thumbnail left, text right — category block lists. */
export function RowLeftCard({
  story,
  className,
  showTime = false,
  last = false,
}: BaseProps & { last?: boolean }) {
  return (
    <article
      className={cn(
        "grid grid-cols-[104px_1fr] gap-3 pb-3 lg:grid-cols-[120px_1fr]",
        last ? "" : "mb-3 border-b border-line",
        className,
      )}
    >
      <Link href={storyHref(story)} className="group contents">
        <StoryImage
          media={story.image}
          seed={`rowleft-${story.id}`}
          className="h-[70px] self-start lg:h-[76px]"
          rounded="rounded-[4px]"
          sizes="120px"
        >
          <Overlays story={story} />
        </StoryImage>
        <div>
          <CategoryLabel
            name={story.subCategory?.name ?? story.category.name}
            asLink={false}
          />
          <h3 className="t-h-sm clamp-3 group-hover:text-brand-dark">{story.title}</h3>
          {showTime ? (
            <TimeAgo value={story.publishedAt} className="mt-1 block" />
          ) : null}
        </div>
      </Link>
    </article>
  );
}

/** Big light-grey number + headline — "सबसे ज़्यादा पढ़ी गईं", trending. */
export function NumberedCard({
  story,
  index,
  className,
  last = false,
}: BaseProps & { index: number; last?: boolean }) {
  return (
    <article
      className={cn(
        "grid grid-cols-[38px_1fr] gap-1.5 py-2.5",
        last ? "" : "border-b border-line",
        className,
      )}
    >
      <span
        className="font-ui text-[28px] font-extrabold leading-none text-[#e3e3e3]"
        aria-hidden="true"
      >
        {index}
      </span>
      <Link href={storyHref(story)} className="group">
        <h3 className="t-h-sm clamp-3 group-hover:text-brand-dark">{story.title}</h3>
      </Link>
    </article>
  );
}

/** Headline only. */
export function TextCard({ story, className, showTime = false }: BaseProps) {
  return (
    <article className={cn("border-b border-line py-2.5", className)}>
      <Link href={storyHref(story)} className="group">
        <h3 className="t-h-sm clamp-3 group-hover:text-brand-dark">{story.title}</h3>
        {showTime ? <TimeAgo value={story.publishedAt} className="mt-1 block" /> : null}
      </Link>
    </article>
  );
}

/** Video list row on the dark band — 170px thumb with a duration pill. */
export function VideoRowCard({ story, className }: BaseProps) {
  return (
    <article className={cn("grid grid-cols-[140px_1fr] gap-3.5 lg:grid-cols-[170px_1fr]", className)}>
      <Link href={storyHref(story)} className="group contents">
        <StoryImage
          media={story.image}
          seed={`vl-${story.id}`}
          className="h-[80px] self-start lg:h-[96px]"
          rounded="rounded-[6px]"
          sizes="170px"
        >
          {story.videoDuration ? <Duration value={story.videoDuration} /> : null}
        </StoryImage>
        <h3 className="t-h-md clamp-3 text-white group-hover:text-[#ffd0d6]">
          {story.title}
        </h3>
      </Link>
    </article>
  );
}
