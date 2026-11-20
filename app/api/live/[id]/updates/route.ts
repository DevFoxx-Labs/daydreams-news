import { getLiveBlogs } from "@/lib/cms";
import { istClock24 } from "@/lib/format/hindiDate";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * GET /api/live/<id>/updates?since=<iso> — new live-blog updates (FR-L2).
 * The client polls this every 30–60s; `since` keeps the payload to the delta.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`live:${ip}`, 240, 60);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const { id } = await params;
  if (!/^[\w-]{1,40}$/.test(id)) {
    return Response.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const blogs = await getLiveBlogs();
  const blog = blogs.find((b) => b.id === id || b.slug === id);
  if (!blog) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const sinceParam = new URL(request.url).searchParams.get("since");
  const since = sinceParam ? Date.parse(sinceParam) : NaN;
  const updates = Number.isNaN(since)
    ? blog.updates
    : blog.updates.filter((update) => Date.parse(update.time) > since);

  return Response.json(
    {
      ok: true,
      status: blog.status,
      updatedAt: blog.updatedAt,
      updates: updates.map((update) => ({
        id: update.id,
        time: update.time,
        clock: istClock24(update.time),
        title: update.title,
        isPinned: update.isPinned ?? false,
      })),
    },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } },
  );
}
