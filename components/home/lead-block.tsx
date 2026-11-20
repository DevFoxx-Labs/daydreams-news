import Link from "next/link";
import { Fragment } from "react";

import { LiveUpdatesBox } from "@/components/home/widgets";
import { AdSlot } from "@/components/news/ad-slot";
import { Container } from "@/components/news/primitives";
import { HeroCard, RowCard, StackCard } from "@/components/news/story-card";
import type { LiveBlog, Story } from "@/lib/data/types";
import { t } from "@/lib/i18n";

/**
 * Lead block — DESIGN.md §5.1.
 *
 * Desktop (≥ lg): grid `300px | 1fr | 330px` — top news, hero, live box.
 * Tablet: hero full width, then top news and the live box in two columns.
 * Mobile: hero, then the row list with the live box after the third story.
 *
 * The live box is rendered twice (once inline for mobile, once in the rail)
 * and hidden with `display:none`, so only one copy is ever in the
 * accessibility tree.
 */
export function LeadBlock({
  hero,
  secondary,
  topNews,
  liveBlog,
  liveBreaking,
}: {
  hero: Story;
  secondary: Story[];
  topNews: Story[];
  liveBlog: LiveBlog | null;
  liveBreaking: Story[];
}) {
  return (
    <Container className="!px-0 md:!px-6 xl:!px-0">
      <div className="grid gap-0 md:grid-cols-2 md:gap-6 md:pb-8 md:pt-2.5 lg:grid-cols-[300px_1fr_330px] lg:gap-[26px]">
        {/* Hero + two secondary cards */}
        <div className="md:order-1 md:col-span-2 lg:order-2 lg:col-span-1">
          <HeroCard story={hero} />
          <div className="hidden md:mt-4 md:grid md:grid-cols-2 md:gap-5 lg:mt-[18px]">
            {secondary.map((story) => (
              <StackCard
                key={story.id}
                story={story}
                showTime
                headingClassName="t-h-md"
                imageClassName="h-[150px]"
              />
            ))}
          </div>
        </div>

        {/* टॉप न्यूज़ — on mobile the two secondary stories head the list. */}
        <div className="px-4 pt-3 md:order-2 md:px-0 md:pt-0 lg:order-1">
          <section aria-labelledby="top-news-heading">
            <h2
              id="top-news-heading"
              className="mb-1.5 flex items-center justify-between border-b-[3px] border-brand pb-1.5 text-[20px] font-extrabold"
            >
              {t.home.topNews}
              <Link href="/desh" className="text-[13px] font-semibold text-brand">
                {t.common.allShort}
              </Link>
            </h2>

            {secondary.map((story) => (
              <RowCard key={story.id} story={story} showTime className="md:hidden" />
            ))}

            {topNews.map((story, index) => (
              <Fragment key={story.id}>
                <RowCard
                  story={story}
                  showTime
                  last={index === topNews.length - 1}
                />
                {index === 2 ? (
                  <div className="my-4 md:hidden">
                    <LiveUpdatesBox
                      liveBlog={liveBlog}
                      fallbackStories={liveBreaking}
                    />
                  </div>
                ) : null}
              </Fragment>
            ))}
          </section>
        </div>

        {/* Rail: live box (desktop) + 300×250 */}
        <div className="border-t-8 border-soft px-4 py-3.5 md:order-3 md:border-0 md:px-0 md:py-0 lg:order-3">
          <div className="hidden md:block">
            <LiveUpdatesBox liveBlog={liveBlog} fallbackStories={liveBreaking} />
          </div>
          <AdSlot size="300x250" placement="home-rail-1" />
        </div>
      </div>
    </Container>
  );
}
