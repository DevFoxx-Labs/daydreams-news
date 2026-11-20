import Link from "next/link";

import { SectionHeader } from "@/components/news/section-header";
import { Container } from "@/components/news/primitives";
import {
  PhotoCount,
  PlayBadgeLarge,
  StoryImage,
} from "@/components/news/story-image";
import {
  LeadCard,
  RowLeftCard,
  StackCard,
  VideoRowCard,
} from "@/components/news/story-card";
import type {
  Category,
  Gallery,
  RashiSign,
  Story,
  WebStory,
} from "@/lib/data/types";
import { TimeAgo } from "@/components/news/primitives";
import { t } from "@/lib/i18n";
import {
  categoryHref,
  galleryHref,
  rashiHref,
  storyHref,
  subCategoryHref,
  webStoryHref,
} from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Section blocks of the homepage — DESIGN.md §5.3 – §5.9. */

/** देश / दुनिया block: lead story + four row items, with sub-category links. */
export function CategoryBlock({
  category,
  lead,
  stories,
  children,
}: {
  category: Category;
  lead: Story | null;
  stories: Story[];
  /** Rail content (most read, market, ad …). */
  children?: React.ReactNode;
}) {
  if (!lead) return null;
  return (
    <section className="mb-8 grid gap-6 lg:mb-10 lg:grid-cols-[1fr_330px] lg:gap-[30px]">
      <div>
        <SectionHeader
          title={category.name}
          href={categoryHref(category.slug)}
          moreLabel={t.common.readMore}
          moreHref={categoryHref(category.slug)}
        >
          <div className="flex items-center gap-[18px] text-[15px] font-medium text-ink-2">
            <Link href={categoryHref(category.slug)} className="font-bold text-brand">
              {t.common.all}
            </Link>
            {(category.children ?? []).slice(0, 4).map((child) => (
              <Link
                key={child.slug}
                href={subCategoryHref(category.slug, child.slug)}
                className="whitespace-nowrap hover:text-brand"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </SectionHeader>

        <div className="grid gap-5 md:grid-cols-[1.25fr_1fr] md:gap-[22px]">
          <LeadCard story={lead} />
          <div>
            {stories.map((story, index) => (
              <RowLeftCard
                key={story.id}
                story={story}
                last={index === stories.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
      {children ? <aside>{children}</aside> : null}
    </section>
  );
}

/** वेब स्टोरीज़ — full-width dark band with 7 vertical cards. */
export function WebStoriesRow({ stories }: { stories: WebStory[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="mb-8 bg-ink py-7 lg:mb-10 lg:pb-[34px] lg:pt-[30px]">
      <Container>
        <SectionHeader
          title={t.common.webStories}
          href="/web-stories"
          moreLabel={t.common.viewAll}
          moreHref="/web-stories"
          onDark
          className="!border-[#444]"
        />
        <ul className="no-scrollbar -mx-4 flex snap-x gap-3.5 overflow-x-auto px-4 md:mx-0 md:px-0 lg:grid lg:grid-cols-7 lg:overflow-visible">
          {stories.map((story) => (
            <li
              key={story.slug}
              className="w-[140px] shrink-0 snap-start md:w-[180px] lg:w-auto"
            >
              <Link href={webStoryHref(story)} className="group block">
                <StoryImage
                  media={story.cover}
                  seed={`ws-${story.slug}`}
                  rounded="rounded-[10px]"
                  className="h-[240px] lg:h-[300px]"
                  sizes="180px"
                >
                  <span
                    className="absolute inset-x-2 top-2 z-2 flex gap-[3px]"
                    aria-hidden="true"
                  >
                    {story.slides.slice(0, 7).map((_, index) => (
                      <i
                        key={index}
                        className="h-[2.5px] flex-1 rounded-[2px] bg-white/50"
                      />
                    ))}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 z-2 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3.5 pt-[60px] text-[15px] font-bold leading-[1.3] text-white lg:text-[16px]">
                    <span className="clamp-3 block">{story.title}</span>
                  </span>
                </StoryImage>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** वीडियो — full-width navy band, main video + four rows. */
export function VideoSection({
  main,
  list,
}: {
  main: Story | null;
  list: Story[];
}) {
  if (!main) return null;
  return (
    <section className="mb-8 bg-navy py-8 text-white lg:mb-10">
      <Container>
        <SectionHeader
          title={t.common.video}
          href="/videos"
          moreLabel={t.home.allVideos}
          moreHref="/videos"
          onDark
        >
          <div className="flex items-center gap-[18px] text-[15px] font-medium text-[#b9c6e4]">
            <Link href="/videos" className="font-bold text-white">
              {t.common.all}
            </Link>
            <Link href="/videos?tab=news" className="hover:text-white">
              न्यूज़
            </Link>
            <Link href="/videos?tab=shorts" className="hover:text-white">
              शॉर्ट्स
            </Link>
            <Link href="/videos?tab=interview" className="hover:text-white">
              इंटरव्यू
            </Link>
          </div>
        </SectionHeader>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <article>
            <Link href={storyHref(main)} className="group block">
              <StoryImage
                media={main.image}
                seed={`vmain-${main.id}`}
                rounded="rounded-[8px]"
                className="h-[220px] md:h-[300px] lg:h-[380px]"
                sizes="(max-width: 1023px) 100vw, 760px"
              >
                <PlayBadgeLarge />
              </StoryImage>
              <h3 className="mt-3 text-[20px] font-bold leading-snug text-white lg:text-[24px]">
                {main.title}
              </h3>
              <p className="mt-1 text-[13px] text-[#9fb3d9]">
                {main.videoDuration ? `${main.videoDuration} · ` : ""}
                <TimeAgo value={main.publishedAt} className="!text-[#9fb3d9]" />
              </p>
            </Link>
          </article>
          <div className="flex flex-col gap-3.5">
            {list.map((story) => (
              <VideoRowCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** बिज़नेस · टेक · ऑटो · नौकरी — four stack cards. */
export function BizGrid({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="mb-8 lg:mb-10">
      <SectionHeader
        title={t.home.bizTechAuto}
        moreLabel={t.common.more}
        moreHref="/business"
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-[22px]">
        {stories.map((story) => (
          <StackCard key={story.id} story={story} showTime />
        ))}
      </div>
    </section>
  );
}

/** फ़ोटो गैलरी — bento grid, first tile spans two rows. */
export function PhotoGalleryBento({ galleries }: { galleries: Gallery[] }) {
  if (galleries.length === 0) return null;
  const [first, ...rest] = galleries;
  return (
    <section className="mb-8 lg:mb-10">
      <SectionHeader
        title={t.home.photoGallery}
        href="/photos"
        moreLabel={t.common.allShort}
        moreHref="/photos"
      />
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[180px_180px]">
        <Link
          href={galleryHref(first)}
          className="col-span-2 md:col-span-1 md:row-span-2"
        >
          <StoryImage
            media={first.images[0]}
            seed={`gal-${first.slug}`}
            rounded="rounded-[6px]"
            className="h-[200px] md:h-full"
            sizes="(max-width: 767px) 100vw, 520px"
          >
            <PhotoCount count={first.images.length} />
            <span className="absolute inset-x-0 bottom-0 z-2 bg-gradient-to-t from-black/80 to-transparent px-3.5 pb-3 pt-10 text-[17px] font-bold text-white md:text-[18px]">
              <span className="clamp-2 block">{first.title}</span>
            </span>
          </StoryImage>
        </Link>
        {rest.map((gallery) => (
          <Link key={gallery.slug} href={galleryHref(gallery)}>
            <StoryImage
              media={gallery.images[0]}
              seed={`gal-${gallery.slug}`}
              rounded="rounded-[6px]"
              className="h-[120px] md:h-full"
              sizes="(max-width: 767px) 50vw, 260px"
            >
              <PhotoCount count={gallery.images.length} />
              <span className="sr-only">{gallery.title}</span>
            </StoryImage>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** आज का राशिफल — 12 tiles (4 / 6 / 12 columns). */
export function RashifalGrid({ signs }: { signs: RashiSign[] }) {
  if (signs.length === 0) return null;
  return (
    <section className="mb-10 lg:mb-[46px]">
      <SectionHeader
        title={t.home.rashifal}
        href="/rashifal"
        moreLabel={t.common.detail}
        moreHref="/rashifal"
      />
      <ul className="grid grid-cols-4 gap-2.5 md:grid-cols-6 lg:grid-cols-12">
        {signs.map((sign) => (
          <li key={sign.slug}>
            <Link
              href={rashiHref(sign.slug)}
              className={cn(
                "flex min-h-11 flex-col items-center rounded-[8px] border border-line px-1 py-3.5",
                "text-[15px] font-semibold hover:border-brand hover:text-brand",
              )}
            >
              <span
                className="glyph mb-1 text-[30px] leading-none text-brand"
                aria-hidden="true"
              >
                {sign.glyph}
              </span>
              {sign.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
