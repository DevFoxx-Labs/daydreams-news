import { legalNotices, NOTICE_VERSION_STRING } from "@/lib/legal/notices";

/**
 * GET /api/legal — index of the legal notices with their versions.
 *
 * One source for the website and (later) the Android/iOS apps, so the texts
 * can never drift between platforms (global rule §1).
 */
export async function GET() {
  return Response.json(
    {
      noticeVersion: NOTICE_VERSION_STRING,
      notices: legalNotices.map((notice) => ({
        slug: notice.slug,
        title: notice.title,
        summary: notice.summary,
        version: notice.version,
        lastUpdated: notice.lastUpdated,
        draft: notice.draft,
        url: `/${notice.slug}`,
        apiUrl: `/api/legal/${notice.slug}`,
      })),
    },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } },
  );
}
