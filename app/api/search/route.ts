import { searchStories, type SearchRange, type SearchSort } from "@/lib/cms";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiTimeAgo } from "@/lib/format/hindiDate";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { storyHref } from "@/lib/routes";

/**
 * GET /api/search?q=&cat=&range=&sort=&page= — search and type-ahead
 * suggestions (FR-S1 … FR-S3). Rate-limited because search is the most
 * expensive read on the site.
 */

const RANGES: SearchRange[] = ["24h", "7d", "30d", "any"];
const SORTS: SearchSort[] = ["relevance", "latest"];

export async function GET(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`search:${ip}`, 60, 60);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 120);
  if (q.trim().length < 2) {
    return Response.json({ ok: true, stories: [], total: 0 });
  }

  const rangeParam = url.searchParams.get("range") as SearchRange | null;
  const sortParam = url.searchParams.get("sort") as SearchSort | null;
  const category = url.searchParams.get("cat");
  const page = Number.parseInt(url.searchParams.get("page") ?? "1", 10);

  const result = await searchStories({
    q,
    category: category && /^[a-z-]{2,40}$/.test(category) ? category : undefined,
    range: rangeParam && RANGES.includes(rangeParam) ? rangeParam : "any",
    sort: sortParam && SORTS.includes(sortParam) ? sortParam : "relevance",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });

  return Response.json(
    {
      ok: true,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      stories: result.stories.map((story) => ({
        id: story.id,
        title: story.title,
        href: storyHref(story),
        category: story.subCategory?.name ?? story.category.name,
        timeAgo: hindiTimeAgo(story.publishedAt, MOCK_NOW_ISO),
      })),
    },
    // Search result pages are noindex (SEO-6); the API is cacheable briefly.
    { headers: { "Cache-Control": "public, max-age=30", "X-Robots-Tag": "noindex" } },
  );
}
