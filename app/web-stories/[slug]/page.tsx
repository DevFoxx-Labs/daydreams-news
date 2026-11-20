import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { WebStoryPlayer } from "@/components/stories/web-story-player";
import { getStory, getWebStories, getWebStory } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { storyHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** Web story player page — DESIGN.md §7, FR-W1. */

export async function generateStaticParams() {
  const stories = await getWebStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/web-stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = await getWebStory(slug);
  if (!story) return { title: t.pages.notFoundTitle };
  return {
    title: story.title,
    description: story.slides[0]?.text ?? site.description,
    alternates: { canonical: `/web-stories/${story.slug}` },
    openGraph: { type: "article", title: story.title },
  };
}

export default async function WebStoryPage({
  params,
}: PageProps<"/web-stories/[slug]">) {
  const { slug } = await params;
  const story = await getWebStory(slug);
  if (!story) notFound();

  const article = story.articleId ? await getStory(story.articleId) : null;

  return (
    <SiteShell variant="bare">
      <WebStoryPlayer
        story={story}
        articleHref={article ? storyHref(article) : null}
      />
    </SiteShell>
  );
}
