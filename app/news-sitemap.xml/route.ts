import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { stories } from "@/lib/data/stories";
import { istIso } from "@/lib/format/hindiDate";
import { storyHref } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Google News sitemap — SEO-4. Only the last 48 hours, as Google requires.
 */

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const cutoff = Date.parse(MOCK_NOW_ISO) - 48 * 3_600_000;

  const recent = stories.filter(
    (story) =>
      !story.noindex &&
      story.type !== "webstory" &&
      story.type !== "gallery" &&
      Date.parse(story.publishedAt) >= cutoff,
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recent
  .map(
    (story) => `  <url>
    <loc>${escapeXml(new URL(storyHref(story), site.url).toString())}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(site.name)}</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${istIso(story.publishedAt)}</news:publication_date>
      <news:title>${escapeXml(story.title)}</news:title>
${story.tags?.length ? `      <news:keywords>${escapeXml(story.tags.join(", "))}</news:keywords>\n` : ""}    </news:news>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
