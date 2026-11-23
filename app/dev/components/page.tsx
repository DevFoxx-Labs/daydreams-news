import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { AdSlot } from "@/components/news/ad-slot";
import {
  CategoryLabel,
  Container,
  DemoLabel,
  LiveBadge,
  SideHeading,
  SponsoredLabel,
  TagChip,
  TimeAgo,
} from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import {
  HeroCard,
  LeadCard,
  NumberedCard,
  RowCard,
  RowLeftCard,
  StackCard,
  TextCard,
  VideoRowCard,
} from "@/components/news/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLatest, getVideoStories } from "@/lib/cms";

/**
 * Design-system preview (PRD M0/M1 acceptance: "/dev/components renders").
 * Development only — it 404s in production so it can never be indexed.
 */

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const AD_SIZES = [
  "728x90",
  "970x250",
  "300x250",
  "300x600",
  "320x50",
  "320x100",
  "in-article",
] as const;

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 border-b border-line pb-1 text-[18px] font-extrabold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const [stories, videos] = await Promise.all([getLatest(8), getVideoStories(2)]);

  return (
    <SiteShell variant="full">
      <Container className="py-6">
        <h1 className="mb-6 text-[26px] font-extrabold">
          Daydreams News — design system
        </h1>

        <Row title="Badges & labels">
          <div className="flex flex-wrap items-center gap-3">
            <LiveBadge />
            <CategoryLabel name="मौसम" slug="desh" asLink={false} />
            <TimeAgo value={stories[0].publishedAt} />
            <TagChip label="मौसम अपडेट" slug="mausam" />
            <SponsoredLabel />
            <DemoLabel />
          </div>
        </Row>

        <Row title="Buttons & input">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="brand">सब्सक्राइब करें</Button>
            <Button variant="ink">सभी अस्वीकार करें</Button>
            <Button variant="outline">अपनी पसंद चुनें</Button>
            <Button variant="ghost">और पढ़ें</Button>
            <Button variant="link">और पढ़ें →</Button>
            <Input placeholder="आपका ईमेल" className="max-w-[240px]" />
          </div>
        </Row>

        <Row title="SectionHeader">
          <SectionHeader title="देश" moreLabel="और पढ़ें →" moreHref="/desh" />
          <SideHeading>सबसे ज़्यादा पढ़ी गईं</SideHeading>
        </Row>

        <Row title="StoryCard — hero">
          <HeroCard story={stories[0]} priority={false} />
        </Row>

        <Row title="StoryCard — lead / stack">
          <div className="grid gap-6 md:grid-cols-2">
            <LeadCard story={stories[1]} />
            <StackCard story={stories[2]} showTime showDeck />
          </div>
        </Row>

        <Row title="StoryCard — row / row-left / numbered / text">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <RowCard story={stories[3]} showTime />
              <RowCard story={stories[4]} showTime last />
            </div>
            <div>
              <RowLeftCard story={stories[5]} showTime />
              <RowLeftCard story={stories[6]} showTime last />
            </div>
            <div>
              <NumberedCard story={stories[0]} index={1} />
              <NumberedCard story={stories[1]} index={2} last />
            </div>
            <div>
              <TextCard story={stories[2]} showTime />
              <TextCard story={stories[3]} />
            </div>
          </div>
        </Row>

        <Row title="StoryCard — video row (dark)">
          <div className="space-y-4 bg-navy p-4">
            {videos.map((story) => (
              <VideoRowCard key={story.id} story={story} />
            ))}
          </div>
        </Row>

        <Row title="AdSlot sizes (all reserve their height)">
          <div className="space-y-5">
            {AD_SIZES.map((size) => (
              <AdSlot key={size} size={size} placement={`dev-${size}`} />
            ))}
          </div>
        </Row>
      </Container>
    </SiteShell>
  );
}
