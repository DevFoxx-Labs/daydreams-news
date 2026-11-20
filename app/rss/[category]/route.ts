import { getCategory, getCategoryStories } from "@/lib/cms";
import { buildRss } from "@/lib/seo/rss";
import { site } from "@/lib/site";

/** GET /rss/<category> — per-category feed (SEO-5). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category: slug } = await params;
  if (!/^[a-z-]{2,40}$/.test(slug)) {
    return new Response("Not found", { status: 404 });
  }

  const category = await getCategory(slug);
  if (!category) return new Response("Not found", { status: 404 });

  const list = await getCategoryStories(category.slug);

  return new Response(
    buildRss({
      title: `${site.name} — ${category.name}`,
      description: `${category.name} की ताज़ा ख़बरें`,
      path: `/rss/${category.slug}`,
      stories: list.stories,
    }),
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
