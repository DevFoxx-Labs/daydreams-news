import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ArticleBody } from "@/components/article/article-body";
import { NewsletterBox } from "@/components/article/newsletter-box";
import {
  ArticleTags,
  Breadcrumb,
  Byline,
  Corrections,
  FollowBox,
  Highlights,
  RelatedStories,
} from "@/components/article/parts";
import { ReadingProgress } from "@/components/article/reading-progress";
import { MobileShareBar } from "@/components/article/share-bar";
import { TrendingList } from "@/components/home/widgets";
import { SiteShell } from "@/components/layout/site-shell";
import { AdSlot } from "@/components/news/ad-slot";
import {
  CategoryLabel,
  Container,
  SponsoredLabel,
} from "@/components/news/primitives";
import { StoryImage } from "@/components/news/story-image";
import {
  getMostRead,
  getReadAlsoStory,
  getRelatedStories,
  getStory,
  getStoryRouteParams,
} from "@/lib/cms";
import type { Story } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { parseStorySlug, storyHref } from "@/lib/routes";
import { breadcrumbJsonLd, newsArticleJsonLd } from "@/lib/seo/json-ld";
import { site } from "@/lib/site";

/** Article page — DESIGN.md §6, FR-A1 … FR-A9. */

export async function generateStaticParams() {
  return getStoryRouteParams();
}

async function load(params: Promise<{ category: string; slug: string }>) {
  const { category, slug } = await params;
  const parsed = parseStorySlug(slug);
  if (!parsed) return null;
  const story = await getStory(parsed.id);
  if (!story) return null;
  return { story, category, requestedSlug: parsed.slug };
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]/[slug]">): Promise<Metadata> {
  const found = await load(params);
  if (!found) return { title: t.pages.notFoundTitle };

  const { story } = found;
  const canonical = storyHref(story);
  return {
    title: story.seoTitle ?? story.title,
    description: story.deck ?? site.description,
    alternates: { canonical },
    robots: story.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title: story.title,
      description: story.deck,
      url: canonical,
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt ?? story.publishedAt,
      authors: story.authors.map((author) => author.name),
      section: story.category.name,
      tags: story.tags,
    },
    twitter: { card: "summary_large_image", title: story.title },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[category]/[slug]">) {
  const found = await load(params);
  if (!found) notFound();

  const { story, category, requestedSlug } = found;

  // The id is authoritative; an old slug or the wrong category 301s to the
  // canonical URL instead of serving duplicate content (SEO-1).
  if (story.category.slug !== category || story.slug !== requestedSlug) {
    permanentRedirect(storyHref(story));
  }

  const [related, autoReadAlso, trending] = await Promise.all([
    getRelatedStories(story.id, 3),
    getReadAlsoStory(story.id),
    getMostRead(5),
  ]);

  const referenced: Record<string, Story> = {};
  for (const block of story.body ?? []) {
    if (block.type === "readAlso") {
      const referencedStory = await getStory(block.storyId);
      if (referencedStory) referenced[block.storyId] = referencedStory;
    }
  }

  const path = storyHref(story);
  const absoluteUrl = new URL(path, site.url).toString();
  const breadcrumbs = [
    { label: t.common.home, href: "/" },
    { label: story.category.name, href: `/${story.category.slug}` },
    ...(story.subCategory
      ? [{ label: story.subCategory.name, href: `/${story.subCategory.slug}` }]
      : []),
    { label: story.title },
  ];

  return (
    <SiteShell variant="reading">
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleJsonLd(story)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              breadcrumbs
                .filter((crumb) => crumb.href)
                .map((crumb) => ({ name: crumb.label, url: crumb.href! })),
            ),
          ),
        }}
      />

      {/* Mobile: full-bleed image above the headline (DESIGN.md §6). */}
      <StoryImage
        media={story.image}
        seed={`hero-${story.id}`}
        priority
        rounded="rounded-none"
        className="h-[200px] lg:hidden"
        sizes="100vw"
      />

      <Container>
        <div className="hidden lg:block">
          {/* The headline is in the JSON-LD trail but not in the visible one. */}
          <Breadcrumb items={breadcrumbs.slice(0, -1)} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-[44px]">
          <article className="pt-4 lg:pt-0">
            {story.isSponsored ? <SponsoredLabel className="mb-2" /> : null}
            <CategoryLabel
              name={story.subCategory?.name ?? story.category.name}
              slug={story.subCategory?.slug ?? story.category.slug}
              className="!text-[14px] lg:!text-[15px]"
            />
            <h1 className="t-article-h1 mb-3.5">{story.title}</h1>
            {story.deck ? <p className="t-deck mb-4.5">{story.deck}</p> : null}

            <Highlights items={story.highlights ?? []} />
            <Byline story={story} url={absoluteUrl} />

            {/* Desktop featured image with caption and credit. */}
            <figure className="hidden lg:block">
              <StoryImage
                media={story.image}
                seed={`hero-lg-${story.id}`}
                priority
                rounded="rounded-[6px]"
                className="h-[470px]"
                sizes="(max-width: 1023px) 100vw, 880px"
              />
              <figcaption className="mb-[22px] border-b border-line pb-[22px] pt-2 text-[14px] text-meta">
                {story.image.caption}
                {story.image.isAiGenerated
                  ? ` ${t.common.aiImage}`
                  : story.image.isFile
                    ? ` ${t.common.symbolicImage}`
                    : ""}
                {story.image.credit ? ` — ${story.image.credit}` : ""}
              </figcaption>
            </figure>

            <ArticleBody
              blocks={story.body ?? []}
              readAlsoStories={referenced}
              autoReadAlso={autoReadAlso}
            />

            <ArticleTags tags={story.tags ?? []} />
            <Corrections corrections={story.corrections ?? []} />
            <FollowBox />
            <RelatedStories stories={related} />

            {/* Rail content moves below the article on mobile (§8). */}
            <div className="mb-10 space-y-6 lg:hidden">
              <TrendingList stories={trending} />
              <NewsletterBox />
            </div>
          </article>

          <aside className="hidden lg:block">
            <AdSlot size="300x250" placement="article-rail-1" className="mb-6" />
            <div className="mb-6">
              <TrendingList stories={trending} />
            </div>
            <NewsletterBox className="mb-6" />
            <AdSlot size="300x600" placement="article-rail-sticky" sticky />
          </aside>
        </div>
      </Container>

      <div className="h-[72px] lg:hidden" aria-hidden="true" />
      <MobileShareBar url={absoluteUrl} title={story.title} />
    </SiteShell>
  );
}
