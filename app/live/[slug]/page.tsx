import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsletterBox } from "@/components/article/newsletter-box";
import { Breadcrumb } from "@/components/article/parts";
import { TrendingList } from "@/components/home/widgets";
import { SiteShell } from "@/components/layout/site-shell";
import { LiveTimeline } from "@/components/live/live-timeline";
import { AdSlot } from "@/components/news/ad-slot";
import { CategoryLabel, Container } from "@/components/news/primitives";
import { StoryImage } from "@/components/news/story-image";
import { getLiveBlog, getLiveBlogs, getMostRead } from "@/lib/cms";
import { istClock24 } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { liveHref } from "@/lib/routes";
import { liveBlogJsonLd } from "@/lib/seo/json-ld";

/** Live blog — DESIGN.md §6.1, FR-L1 … FR-L3. */

export async function generateStaticParams() {
  const blogs = await getLiveBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/live/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getLiveBlog(slug);
  if (!blog) return { title: t.pages.notFoundTitle };
  return {
    title: blog.title,
    description: blog.summary,
    alternates: { canonical: liveHref(blog.slug) },
    openGraph: { type: "article", title: blog.title, description: blog.summary },
  };
}

export default async function LiveBlogPage({ params }: PageProps<"/live/[slug]">) {
  const { slug } = await params;
  const blog = await getLiveBlog(slug);
  if (!blog) notFound();

  const trending = await getMostRead(5);

  const updates = blog.updates.map((update) => ({
    id: update.id,
    time: update.time,
    clock: istClock24(update.time),
    title: update.title,
    isPinned: update.isPinned ?? false,
    body: (update.body ?? [])
      .filter((block) => block.type === "paragraph")
      .map((block) => (block.type === "paragraph" ? block.text : "")),
  }));

  return (
    <SiteShell variant="reading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(liveBlogJsonLd(blog)) }}
      />

      <Container>
        <Breadcrumb
          items={[
            { label: t.common.home, href: "/" },
            { label: blog.category.name, href: `/${blog.category.slug}` },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-[44px]">
          <article>
            <CategoryLabel
              name={blog.category.name}
              slug={blog.category.slug}
              className="!text-[14px] lg:!text-[15px]"
            />
            <h1 className="t-article-h1 mb-3.5">{blog.title}</h1>
            {blog.summary ? <p className="t-deck mb-4">{blog.summary}</p> : null}

            <StoryImage
              media={blog.image}
              seed={`live-${blog.id}`}
              priority
              rounded="rounded-[6px]"
              className="mb-5 h-[200px] md:h-[320px] lg:h-[420px]"
              sizes="(max-width: 1023px) 100vw, 880px"
            />

            {blog.keyEvents.length > 0 ? (
              <aside
                aria-labelledby="key-events"
                className="mb-5 border-s-4 border-brand bg-brand-tint px-4 py-3.5"
              >
                <h2
                  id="key-events"
                  className="mb-1.5 text-[15px] font-extrabold text-brand"
                >
                  {t.live.keyEvents}
                </h2>
                <ul className="list-disc space-y-1 ps-4">
                  {blog.keyEvents.map((event) => (
                    <li key={event} className="text-[16px] font-medium leading-[1.6]">
                      {event}
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            <LiveTimeline
              blogId={blog.id}
              initialUpdates={updates}
              status={blog.status}
            />

            <div className="mb-10 mt-8 space-y-6 lg:hidden">
              <TrendingList stories={trending} />
              <NewsletterBox />
            </div>
          </article>

          <aside className="hidden lg:block">
            <AdSlot size="300x250" placement="live-rail-1" className="mb-6" />
            <div className="mb-6">
              <TrendingList stories={trending} />
            </div>
            <NewsletterBox className="mb-6" />
            <AdSlot size="300x600" placement="live-rail-sticky" sticky />
          </aside>
        </div>
      </Container>
    </SiteShell>
  );
}
