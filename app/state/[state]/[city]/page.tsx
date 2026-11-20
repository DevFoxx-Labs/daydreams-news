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
import { getLatest, getMostRead, getState, getStateStories, getStates } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { stateHref } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** City page — `/state/<state>/<city>` (FR-C1). */

export async function generateStaticParams() {
  const states = await getStates();
  return states.flatMap((state) =>
    state.cities.map((city) => ({ state: state.slug, city: city.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/state/[state]/[city]">): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const state = await getState(stateSlug);
  const city = state?.cities.find((entry) => entry.slug === citySlug);
  if (!state || !city) return { title: t.pages.notFoundTitle };
  return {
    title: `${city.name} की ताज़ा ख़बरें`,
    description: `${city.name} (${state.name}) की ख़बरें, मौसम और स्थानीय अपडेट — ${site.name} पर।`,
    alternates: { canonical: stateHref(state.slug, city.slug) },
  };
}

type Query = Record<string, string | string[] | undefined>;

async function CityList({
  stateSlug,
  citySlug,
  searchParams,
}: {
  stateSlug: string;
  citySlug: string;
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const requested = Number.parseInt(
    typeof query.page === "string" ? query.page : "1",
    10,
  );

  const [list, latest] = await Promise.all([
    getStateStories(stateSlug, {
      city: citySlug,
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
        adPlacement={`city-${citySlug}`}
      />
      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        basePath={stateHref(stateSlug, citySlug)}
      />
    </>
  );
}

export default async function CityPage({
  params,
  searchParams,
}: PageProps<"/state/[state]/[city]">) {
  const { state: stateSlug, city: citySlug } = await params;

  const state = await getState(stateSlug);
  const city = state?.cities.find((entry) => entry.slug === citySlug);
  if (!state || !city) notFound();

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
              { name: city.name, url: stateHref(state.slug, city.slug) },
            ]),
          ),
        }}
      />

      <Container className="pt-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:gap-[30px]">
          <div>
            <SectionHeader title={city.name} as="h1" />

            <nav
              aria-label={t.pages.cityNews}
              className="no-scrollbar mb-5 flex gap-2 overflow-x-auto"
            >
              <Link
                href={stateHref(state.slug)}
                className="shrink-0 whitespace-nowrap rounded-[4px] border border-line bg-white px-3.5 py-2 text-[15px] font-semibold hover:border-brand hover:text-brand"
              >
                {state.name}
              </Link>
              {state.cities.map((entry) => (
                <Link
                  key={entry.slug}
                  href={stateHref(state.slug, entry.slug)}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-[4px] border px-3.5 py-2 text-[15px] font-semibold",
                    entry.slug === city.slug
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-white hover:border-brand hover:text-brand",
                  )}
                >
                  {entry.name}
                </Link>
              ))}
            </nav>

            <Suspense fallback={<StoryListSkeleton />}>
              <CityList
                stateSlug={state.slug}
                citySlug={city.slug}
                searchParams={searchParams}
              />
            </Suspense>
          </div>

          <aside className="space-y-6">
            <AdSlot size="300x250" placement={`city-${city.slug}-rail`} />
            <MostRead stories={mostRead} />
            <NewsletterBox />
          </aside>
        </div>
      </Container>
    </SiteShell>
  );
}
