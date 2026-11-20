import type { Story } from "@/lib/data/types";
import { storyHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** RSS 2.0 feed builder — SEO-5. */

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRss({
  title,
  description,
  path,
  stories,
}: {
  title: string;
  description: string;
  path: string;
  stories: Story[];
}): string {
  const abs = (target: string) => new URL(target, site.url).toString();
  const lastBuild = stories[0]?.publishedAt ?? new Date(0).toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${abs(path)}</link>
    <description>${escapeXml(description)}</description>
    <language>hi</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${abs(path)}" rel="self" type="application/rss+xml" />
${stories
  .map(
    (story) => `    <item>
      <title>${escapeXml(story.title)}</title>
      <link>${abs(storyHref(story))}</link>
      <guid isPermaLink="false">${story.id}</guid>
      <pubDate>${new Date(story.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(story.category.name)}</category>
      <description>${escapeXml(story.deck ?? story.title)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;
}
