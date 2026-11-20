import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { NewsletterBox } from "@/components/article/newsletter-box";
import { MostRead } from "@/components/home/widgets";
import { SiteShell } from "@/components/layout/site-shell";
import { AdSlot } from "@/components/news/ad-slot";
import { StoryListSkeleton } from "@/components/news/list-skeleton";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import {
  EmptyCategory,
  Pagination,
  StoryList,
} from "@/components/news/story-list";
import {
  getAllCategories,
  getCategory,
  getCategoryStories,
  getLatest,
  getMostRead,
} from "@/lib/cms";
import { t } from "@/lib/i18n";
import { categoryHref, subCategoryHref } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Category page — DESIGN.md §7, FR-C1 … FR-C4.
 *
 * The header, sub-category links and rail are prerendered; only the list,
 * which depends on `?page=` and `?sub=`, streams in behind `<Suspense>`.
 */

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: t.pages.notFoundTitle };
  return {
    title: `${category.name} — ताज़ा ख़बरें`,
    description: `${category.name} से जुड़ी ताज़ा ख़बरें, अपडेट और विश्लेषण — ${site.name} पर।`,
    alternates: {
      canonical: categoryHref(category.slug),
      types: { "application/rss+xml": `/rss/${category.slug}` },
    },
  };
}

type Query = Record<string, string | string[] | undefined>;

async function CategoryList({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const sub = typeof query.sub === "string" ? query.sub : undefined;
  const requested = Number.parseInt(
    typeof query.page === "string" ? query.page : "1",
    10,
  );

  const [list, latest] = await Promise.all([
    getCategoryStories(slug, {
      page: Number.isFinite(requested) && requested > 0 ? requested : 1,
      sub,
    }),
    getLatest(6),
  ]);

  if (list.stories.length === 0) return <EmptyCategory fallback={latest} />;

  return (
    <>
      <StoryList
        stories={list.stories}
        withLead={list.page === 1}
        adPlacement={`cat-${slug}`}
      />
      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        basePath={categoryHref(slug)}
        searchParams={{ sub }}
      />
    </>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/[category]">) {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const mostRead = await getMostRead(6);

  return (
    <SiteShell variant="full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t.common.home, url: "/" },
              { name: category.name, url: categoryHref(category.slug) },
            ]),
          ),
        }}
      />

      <Container className="pt-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:gap-[30px]">
          <div>
            <SectionHeader title={category.name} as="h1">
              {(category.children?.length ?? 0) > 0 ? (
                <div className="flex items-center gap-[18px] text-[15px] font-medium text-ink-2">
                  <Link
                    href={categoryHref(category.slug)}
                    className={cn("font-bold text-brand")}
                  >
                    {t.common.all}
                  </Link>
                  {category.children?.map((child) => (
                    <Link
                      key={child.slug}
                      href={subCategoryHref(category.slug, child.slug)}
                      className="whitespace-nowrap hover:text-brand"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </SectionHeader>

            <Suspense fallback={<StoryListSkeleton />}>
              <CategoryList slug={category.slug} searchParams={searchParams} />
            </Suspense>
          </div>

          <aside className="space-y-6">
            <AdSlot size="300x250" placement={`cat-${category.slug}-rail`} />
            <MostRead stories={mostRead} />
            <NewsletterBox />
          </aside>
        </div>
      </Container>
    </SiteShell>
  );
}
