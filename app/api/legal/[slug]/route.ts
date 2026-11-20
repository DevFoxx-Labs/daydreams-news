import { legalNoticeBySlug } from "@/lib/legal/notices";

/** GET /api/legal/<slug> — the full text of one notice, for the apps. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const notice = legalNoticeBySlug[slug];
  if (!notice) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json(notice, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
  });
}
