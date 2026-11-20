import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import { StoryListSkeleton } from "@/components/news/list-skeleton";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import {
  EmptyCategory,
  Pagination,
  StoryList,
} from "@/components/news/story-list";
import { getLatest, getTagStories } from "@/lib/cms";
import { tagHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** Tag page. Thin tag pages (< 3 stories) are noindex — SEO-6. */

const label = (slug: string) => decodeURIComponent(slug).replace(/-/g, " ");

export async function generateMetadata({
  params,
}: PageProps<"/tag/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const list = await getTagStories(slug);
  const name = label(slug);
  return {
    title: `${name} — ताज़ा ख़बरें`,
    description: `${name} से जुड़ी ख़बरें — ${site.name}`,
    alternates: { canonical: tagHref(slug) },
    robots: list.total < 3 ? { index: false, follow: true } : undefined,
  };
}

type Query = Record<string, string | string[] | undefined>;

async function TagList({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Query>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const requested = Number.parseInt(
    typeof query.page === "string" ? query.page : "1",
    10,
  );

  const [list, latest] = await Promise.all([
    getTagStories(slug, Number.isFinite(requested) && requested > 0 ? requested : 1),
    getLatest(6),
  ]);

  return (
    <>
      <SectionHeader title={`# ${label(slug)}`} as="h1" />
      {list.stories.length === 0 ? <EmptyCategory fallback={latest} /> : null}
      <StoryList
        stories={list.stories}
        withLead={list.page === 1}
        adPlacement={`tag-${slug}`}
      />
      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        basePath={tagHref(slug)}
      />
    </>
  );
}

export default function TagPage({ params, searchParams }: PageProps<"/tag/[slug]">) {
  // Tags are open-ended (no `generateStaticParams`), so the tag name itself is
  // request-time data and lives inside the Suspense boundary with the list.
  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <Suspense fallback={<StoryListSkeleton />}>
          <TagList params={params} searchParams={searchParams} />
        </Suspense>
      </Container>
    </SiteShell>
  );
}
