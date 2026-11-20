import type { Metadata } from "next";

import { LeadBlock } from "@/components/home/lead-block";
import {
  BizGrid,
  CategoryBlock,
  PhotoGalleryBento,
  RashifalGrid,
  VideoSection,
  WebStoriesRow,
} from "@/components/home/sections";
import { StateStrip } from "@/components/home/state-strip";
import {
  MarketWidget,
  MostRead,
  ScoreCard,
} from "@/components/home/widgets";
import { SiteShell } from "@/components/layout/site-shell";
import { AdSlot, ResponsiveAdSlot } from "@/components/news/ad-slot";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { RowLeftCard, StackCard } from "@/components/news/story-card";
import {
  getCategory,
  getFeaturedStates,
  getHomeData,
  getStateStories,
} from "@/lib/cms";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiTimeAgo } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { storyHref } from "@/lib/routes";
import { getMarket, getScorecard } from "@/lib/services/widgets";
import { site } from "@/lib/site";
import { websiteJsonLd } from "@/lib/seo/json-ld";

/** Homepage — DESIGN.md §5, FR-H1 … FR-H7. */

export const metadata: Metadata = {
  title: `${site.name} — ताज़ा हिंदी समाचार, देश-दुनिया और आपके शहर की ख़बरें`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [home, featuredStates, deshCategory, duniyaCategory, market, score] =
    await Promise.all([
      getHomeData(),
      getFeaturedStates(),
      getCategory("desh"),
      getCategory("duniya"),
      getMarket(),
      getScorecard(),
    ]);

  // The server renders the default state; the strip swaps in the reader's
  // saved state after mount (FR-H3).
  const defaultState = featuredStates[0];
  const stateFeed = await getStateStories(defaultState.slug, { count: 6 });

  return (
    <SiteShell variant="full">
      <script
        type="application/ld+json"
        // Static, self-generated JSON-LD — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

      <LeadBlock
        hero={home.hero}
        secondary={home.secondary}
        topNews={home.topNews}
        liveBlog={home.liveBlog}
        liveBreaking={home.liveBreaking}
      />

      <StateStrip
        states={featuredStates}
        initialState={defaultState.slug}
        initialStories={stateFeed.stories.map((story) => ({
          id: story.id,
          title: story.title,
          href: storyHref(story),
          category: story.subCategory?.name ?? story.category.name,
          timeAgo: hindiTimeAgo(story.publishedAt, MOCK_NOW_ISO),
        }))}
      />

      <Container className="mb-8">
        <ResponsiveAdSlot
          mobile="320x100"
          desktop="970x250"
          placement="home-after-states"
        />
      </Container>

      <Container>
        {deshCategory ? (
          <CategoryBlock
            category={deshCategory}
            lead={home.deshLead}
            stories={home.deshList}
          >
            <MostRead stories={home.mostRead} />
          </CategoryBlock>
        ) : null}
      </Container>

      <WebStoriesRow stories={home.webStories} />

      <Container>
        {/* खेल · मनोरंजन · rail — DESIGN.md §5.5 */}
        <section className="mb-8 grid gap-6 lg:mb-10 lg:grid-cols-[1fr_1fr_330px] lg:gap-[30px]">
          <div>
            <SectionHeader
              title="खेल"
              href="/khel"
              moreLabel={t.common.more}
              moreHref="/khel"
            />
            <ScoreCard result={score} />
            {home.cricketStory ? (
              <StackCard story={home.cricketStory} showTime />
            ) : null}
          </div>

          <div>
            <SectionHeader
              title="मनोरंजन"
              href="/manoranjan"
              moreLabel={t.common.more}
              moreHref="/manoranjan"
            />
            {home.entertainmentLead ? (
              <StackCard
                story={home.entertainmentLead}
                imageClassName="h-[200px] lg:h-[220px]"
                headingClassName="t-h-lg"
                showTime
              />
            ) : null}
            <div className="mt-3.5">
              {home.entertainmentList.map((story, index) => (
                <RowLeftCard
                  key={story.id}
                  story={story}
                  last={index === home.entertainmentList.length - 1}
                />
              ))}
            </div>
          </div>

          <aside>
            <MarketWidget result={market} />
            <AdSlot size="300x250" placement="home-rail-2" />
          </aside>
        </section>
      </Container>

      <VideoSection main={home.videoMain} list={home.videoList} />

      <Container>
        {duniyaCategory ? (
          <CategoryBlock
            category={duniyaCategory}
            lead={home.duniyaLead}
            stories={home.duniyaList}
          >
            <AdSlot size="300x250" placement="home-rail-3" />
          </CategoryBlock>
        ) : null}

        <BizGrid stories={home.bizGrid} />
        <PhotoGalleryBento galleries={home.galleries} />
        <RashifalGrid signs={home.rashiSigns} />

        <div className="mb-10">
          <ResponsiveAdSlot
            mobile="320x100"
            desktop="970x250"
            placement="home-before-footer"
          />
        </div>
      </Container>
    </SiteShell>
  );
}
