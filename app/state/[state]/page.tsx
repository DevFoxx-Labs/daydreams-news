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
  getLatest,
  getMostRead,
  getState,
  getStateStories,
  getStates,
} from "@/lib/cms";
import { t } from "@/lib/i18n";
import { stateHref } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { site } from "@/lib/site";

/** State page — DESIGN.md §7, FR-C1 / FR-C3 (city chips at the top). */

export async function generateStaticParams() {
  const states = await getStates();
  return states.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/state/[state]">): Promise<Metadata> {
  const { state: slug } = await params;
  const state = await getState(slug);
  if (!state) return { title: t.pages.notFoundTitle };
  return {
    title: `${state.name} की ताज़ा ख़बरें`,
    description: `${state.name} के शहरों, प्रशासन, मौसम और रोज़मर्रा की ख़बरें — ${site.name} पर।`,
    alternates: { canonical: stateHref(state.slug) },
  };
}

type Query = Record<string, string | string[] | undefined>;

async function StateList({
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

  const [list, latest] = await Promise.all([
    getStateStories(slug, {
      page: Number.isFinite(requested) && requested > 0 ? requested : 1,
    }),
    getLatest(6),
  ]);

  if (list.stories.length === 0) return <EmptyCategory fallback={latest} />;

  return (
    <>
      <StoryList
        stories={list.stories}
        withLead={list.page === 1}
        adPlacement={`state-${slug}`}
      />
      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        basePath={stateHref(slug)}
      />
    </>
  );
}

export default async function StatePage({
  params,
  searchParams,
}: PageProps<"/state/[state]">) {
  const { state: slug } = await params;
  const state = await getState(slug);
  if (!state) notFound();

  const mostRead = await getMostRead(6);

  return (
    <SiteShell variant="full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t.common.home, url: "/" },
              { name: state.name, url: stateHref(state.slug) },
            ]),
          ),
        }}
      />

      <Container className="pt-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:gap-[30px]">
          <div>
            <SectionHeader title={state.name} as="h1" />

            <nav
              aria-label={t.pages.cityNews}
              className="no-scrollbar mb-5 flex gap-2 overflow-x-auto"
            >
              {state.cities.map((city) => (
                <Link
                  key={city.slug}
                  href={stateHref(state.slug, city.slug)}
                  className="shrink-0 whitespace-nowrap rounded-[4px] border border-line bg-white px-3.5 py-2 text-[15px] font-semibold hover:border-brand hover:text-brand"
                >
                  {city.name}
                </Link>
              ))}
            </nav>

            <Suspense fallback={<StoryListSkeleton />}>
              <StateList slug={state.slug} searchParams={searchParams} />
            </Suspense>
          </div>

          <aside className="space-y-6">
            <AdSlot size="300x250" placement={`state-${state.slug}-rail`} />
            <MostRead stories={mostRead} />
            <NewsletterBox />
          </aside>
        </div>
      </Container>
    </SiteShell>
  );
}
