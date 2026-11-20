import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import { StoryListSkeleton } from "@/components/news/list-skeleton";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { Pagination, StoryList } from "@/components/news/story-list";
import { getAuthor, getAuthors, getAuthorStories } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { authorHref } from "@/lib/routes";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import { site } from "@/lib/site";

/** Author page — SEO-8 (E-E-A-T). */

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/author/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: t.pages.notFoundTitle };
  return {
    title: `${author.name} ${t.pages.authorStories}`,
    description: author.bio ?? `${author.name} — ${site.name}`,
    alternates: { canonical: authorHref(author.slug) },
  };
}

type Query = Record<string, string | string[] | undefined>;

async function AuthorStories({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const requested = Number.parseInt(
    typeof query.page === "string" ? query.page : "1",
    10,
  );
  const list = await getAuthorStories(
    slug,
    Number.isFinite(requested) && requested > 0 ? requested : 1,
  );

  return (
    <>
      <StoryList
        stories={list.stories}
        withLead={list.page === 1}
        adPlacement={`author-${slug}`}
      />
      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        basePath={authorHref(slug)}
      />
    </>
  );
}

export default async function AuthorPage({
  params,
  searchParams,
}: PageProps<"/author/[slug]">) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  return (
    <SiteShell variant="full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: author.name,
              jobTitle: author.role,
              description: author.bio,
              url: new URL(authorHref(author.slug), site.url).toString(),
              worksFor: organizationJsonLd(),
            },
          }),
        }}
      />

      <Container className="pt-5">
        <div className="mb-6 flex items-start gap-4 rounded-[6px] border border-line p-4">
          <span
            className="grid size-16 shrink-0 place-items-center rounded-full bg-[#f3d5da] text-[24px] font-extrabold text-brand"
            aria-hidden="true"
          >
            {author.name.slice(0, 2)}
          </span>
          <div>
            <h1 className="text-[22px] font-extrabold lg:text-[26px]">
              {author.name}
            </h1>
            {author.role ? (
              <p className="text-[14px] font-semibold text-brand">{author.role}</p>
            ) : null}
            {author.bio ? (
              <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-2">
                {author.bio}
              </p>
            ) : null}
          </div>
        </div>

        <SectionHeader title={`${author.name} ${t.pages.authorStories}`} />
        <Suspense fallback={<StoryListSkeleton />}>
          <AuthorStories slug={author.slug} searchParams={searchParams} />
        </Suspense>
      </Container>
    </SiteShell>
  );
}
