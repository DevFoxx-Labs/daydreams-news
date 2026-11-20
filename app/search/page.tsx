import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import { StoryListSkeleton } from "@/components/news/list-skeleton";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { Pagination, StoryList } from "@/components/news/story-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAllCategories,
  searchStories,
  type SearchRange,
  type SearchSort,
} from "@/lib/cms";
import type { Category } from "@/lib/data/types";
import { fill, t } from "@/lib/i18n";

/**
 * Search — FR-S1 … FR-S3. Results pages are noindex (SEO-6).
 * The form and the results both depend on `?q=`, so they stream inside a
 * Suspense boundary while the page chrome is prerendered.
 */

export const metadata: Metadata = {
  title: t.search.title,
  robots: { index: false, follow: true },
};

const RANGES: { value: SearchRange; label: string }[] = [
  { value: "any", label: t.search.rangeAny },
  { value: "24h", label: t.search.range24h },
  { value: "7d", label: t.search.range7d },
  { value: "30d", label: t.search.range30d },
];

const SORTS: { value: SearchSort; label: string }[] = [
  { value: "relevance", label: t.search.sortRelevance },
  { value: "latest", label: t.search.sortLatest },
];

const selectClass =
  "h-11 rounded-[4px] border border-line bg-white px-3 text-[15px] text-ink";

type Query = Record<string, string | string[] | undefined>;

function SearchForm({
  q,
  cat,
  range,
  sort,
  categories,
}: {
  q: string;
  cat: string;
  range: SearchRange;
  sort: SearchSort;
  categories: Category[];
}) {
  return (
    <form method="get" action="/search" className="mb-6">
      <div className="flex flex-col gap-2 md:flex-row">
        <label htmlFor="search-q" className="sr-only">
          {t.common.searchPlaceholder}
        </label>
        <Input
          id="search-q"
          type="search"
          name="q"
          defaultValue={q}
          maxLength={120}
          placeholder={t.common.searchPlaceholder}
          className="md:flex-1"
        />
        <Button type="submit" variant="brand" size="lg">
          {t.search.submit}
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="search-cat">
          {t.search.category}
        </label>
        <select id="search-cat" name="cat" defaultValue={cat} className={selectClass}>
          <option value="">
            {t.search.category}: {t.common.all}
          </option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="search-range">
          {t.search.dateRange}
        </label>
        <select
          id="search-range"
          name="range"
          defaultValue={range}
          className={selectClass}
        >
          {RANGES.map((option) => (
            <option key={option.value} value={option.value}>
              {t.search.dateRange}: {option.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="search-sort">
          {t.search.sort}
        </label>
        <select
          id="search-sort"
          name="sort"
          defaultValue={sort}
          className={selectClass}
        >
          {SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {t.search.sort}: {option.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

async function SearchResults({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 120) : "";
  const cat = typeof query.cat === "string" ? query.cat : "";
  const rangeParam = typeof query.range === "string" ? query.range : "any";
  const sortParam = typeof query.sort === "string" ? query.sort : "relevance";
  const range = (RANGES.some((option) => option.value === rangeParam)
    ? rangeParam
    : "any") as SearchRange;
  const sort = (SORTS.some((option) => option.value === sortParam)
    ? sortParam
    : "relevance") as SearchSort;
  const requested = Number.parseInt(
    typeof query.page === "string" ? query.page : "1",
    10,
  );

  const [categories, results] = await Promise.all([
    getAllCategories(),
    q
      ? searchStories({
          q,
          category: cat || undefined,
          range,
          sort,
          page: Number.isFinite(requested) && requested > 0 ? requested : 1,
        })
      : Promise.resolve({
          stories: [],
          total: 0,
          page: 1,
          perPage: 20,
          totalPages: 1,
        }),
  ]);

  return (
    <>
      <SearchForm q={q} cat={cat} range={range} sort={sort} categories={categories} />

      {q ? (
        <>
          <p className="mb-4 text-[15px] text-muted">
            {fill(t.search.resultsFor, { q })} ·{" "}
            {fill(t.search.count, { n: results.total })}
          </p>
          {results.stories.length === 0 ? (
            <div className="pb-10">
              <p className="text-[17px] font-semibold">{t.search.noResults}</p>
              <p className="mt-1 text-[15px] text-muted">{t.search.noResultsHelp}</p>
            </div>
          ) : (
            <>
              <StoryList
                stories={results.stories}
                withLead={false}
                adPlacement="search"
              />
              <Pagination
                page={results.page}
                totalPages={results.totalPages}
                basePath="/search"
                searchParams={{ q, cat, range, sort }}
              />
            </>
          )}
        </>
      ) : null}
    </>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <SectionHeader title={t.search.title} as="h1" />
        <Suspense fallback={<StoryListSkeleton rows={4} />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </Container>
    </SiteShell>
  );
}
