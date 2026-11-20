import { getLatest } from "@/lib/cms";
import { buildRss } from "@/lib/seo/rss";
import { site } from "@/lib/site";

/** GET /rss — the main feed (SEO-5). */
export async function GET() {
  const stories = await getLatest(40);

  return new Response(
    buildRss({
      title: `${site.name} — ताज़ा ख़बरें`,
      description: site.description,
      path: "/rss",
      stories,
    }),
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
