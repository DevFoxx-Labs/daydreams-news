import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { AdSlot } from "@/components/news/ad-slot";
import {
  CategoryLabel,
  Container,
  TimeAgo,
} from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import {
  Duration,
  PlayBadgeLarge,
  StoryImage,
} from "@/components/news/story-image";
import { getVideoStories, getVideoStory } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { parseStorySlug, storyHref } from "@/lib/routes";
import { newsArticleJsonLd } from "@/lib/seo/json-ld";

/** Video page with an up-next list — FR-V2 (`VideoObject` schema). */

export async function generateStaticParams() {
  const videos = await getVideoStories(50);
  return videos.map((story) => ({ slug: `${story.slug}-${story.id}` }));
}

export async function generateMetadata({
  params,
}: PageProps<"/videos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseStorySlug(slug);
  const story = parsed ? await getVideoStory(parsed.id) : null;
  if (!story) return { title: t.pages.notFoundTitle };
  return {
    title: story.title,
    description: story.deck,
    alternates: { canonical: storyHref(story) },
  };
}

export default async function VideoPage({ params }: PageProps<"/videos/[slug]">) {
  const { slug } = await params;
  const parsed = parseStorySlug(slug);
  const story = parsed ? await getVideoStory(parsed.id) : null;
  if (!story) notFound();

  const upNext = (await getVideoStories(6)).filter(
    (entry) => entry.id !== story.id,
  );

  return (
    <SiteShell variant="reading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleJsonLd(story)),
        }}
      />
      <Container className="pt-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-[44px]">
          <article>
            <StoryImage
              media={story.image}
              seed={`vplayer-${story.id}`}
              priority
              rounded="rounded-[8px]"
              className="aspect-video"
              sizes="(max-width: 1023px) 100vw, 860px"
            >
              <PlayBadgeLarge />
              {story.videoDuration ? (
                <Duration value={story.videoDuration} />
              ) : null}
            </StoryImage>
            <p className="mt-2 text-[13px] text-muted">
              डेमो वीडियो — असली प्लेयर (YouTube फ़साड) CMS से वीडियो आईडी मिलने पर लोड होगा।
            </p>

            <CategoryLabel
              name={story.subCategory?.name ?? story.category.name}
              slug={story.category.slug}
              className="mt-4"
            />
            <h1 className="t-h-lg mb-2">{story.title}</h1>
            <TimeAgo value={story.publishedAt} />
            {story.deck ? (
              <p className="mt-3 text-[16px] leading-[1.6] text-ink-2">
                {story.deck}
              </p>
            ) : null}
          </article>

          <aside>
            <SectionHeader title="और वीडियो" />
            <ul className="mb-6 space-y-3">
              {upNext.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={storyHref(entry)}
                    className="group grid grid-cols-[140px_1fr] gap-3"
                  >
                    <StoryImage
                      media={entry.image}
                      seed={`up-${entry.id}`}
                      className="aspect-video"
                      rounded="rounded-[6px]"
                      sizes="140px"
                    >
                      {entry.videoDuration ? (
                        <Duration value={entry.videoDuration} />
                      ) : null}
                    </StoryImage>
                    <span className="t-h-sm clamp-3 group-hover:text-brand-dark">
                      {entry.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <AdSlot size="300x250" placement="video-rail" />
          </aside>
        </div>
      </Container>
    </SiteShell>
  );
}
