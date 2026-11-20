import { getState, getStateStories } from "@/lib/cms";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiTimeAgo } from "@/lib/format/hindiDate";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { storyHref } from "@/lib/routes";

/**
 * GET /api/state-feed?state=<slug> — six latest stories for the home state
 * strip (FR-H3). Read-only and cached; rate-limited anyway so it can't be
 * used to hammer the origin.
 */
export async function GET(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`state-feed:${ip}`, 120, 60);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const slug = new URL(request.url).searchParams.get("state") ?? "";
  if (!/^[a-z-]{2,40}$/.test(slug)) {
    return Response.json({ ok: false, error: "invalid_state" }, { status: 400 });
  }

  const state = await getState(slug);
  if (!state) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const feed = await getStateStories(slug, { count: 6 });

  return Response.json(
    {
      ok: true,
      state: { slug: state.slug, name: state.name },
      stories: feed.stories.map((story) => ({
        id: story.id,
        title: story.title,
        href: storyHref(story),
        category: story.subCategory?.name ?? story.category.name,
        timeAgo: hindiTimeAgo(story.publishedAt, MOCK_NOW_ISO),
        scene: story.image.scene ?? null,
      })),
    },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } },
  );
}
