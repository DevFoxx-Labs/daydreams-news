import Link from "next/link";

import { AdSlot } from "@/components/news/ad-slot";
import { LeadCard, RowCard } from "@/components/news/story-card";
import type { Story } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Category / state / author list body — FR-C2.
 * Lead block (1 big + 4 rows) then a paginated list with an in-feed ad after
 * every six stories.
 */
export function StoryList({
  stories,
  withLead = true,
  adPlacement,
}: {
  stories: Story[];
  withLead?: boolean;
  adPlacement: string;
}) {
  if (stories.length === 0) return null;

  const lead = withLead ? stories[0] : null;
  const leadRows = withLead ? stories.slice(1, 5) : [];
  const rest = withLead ? stories.slice(5) : stories;

  return (
    <>
      {lead ? (
        <div className="mb-6 grid gap-5 md:grid-cols-[1.25fr_1fr] md:gap-[22px]">
          <LeadCard story={lead} priority />
          <div>
            {leadRows.map((story, index) => (
              <RowCard
                key={story.id}
                story={story}
                showTime
                last={index === leadRows.length - 1}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="md:grid md:grid-cols-2 md:gap-x-6">
        {rest.map((story, index) => (
          <div key={story.id} className={cn(index % 6 === 5 && "md:col-span-2")}>
            <RowCard story={story} showTime />
            {index % 6 === 5 ? (
              <AdSlot
                size="300x250"
                placement={`${adPlacement}-infeed-${Math.floor(index / 6)}`}
                className="my-5"
              />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Numbered pagination for desktop and a "load more" link on mobile
 * (FR-C2). Both are plain links, so they work without JavaScript and are
 * crawlable (`?page=2`).
 */
export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label={t.common.page} className="my-8">
      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          className="flex h-11 items-center justify-center rounded-[4px] border border-brand text-[15px] font-bold text-brand md:hidden"
        >
          {t.common.loadMore}
        </Link>
      ) : null}

      <ol className="hidden items-center justify-center gap-2 md:flex">
        {page > 1 ? (
          <li>
            <Link
              href={href(page - 1)}
              rel="prev"
              className="grid h-10 min-w-10 place-items-center rounded-[4px] border border-line px-3 text-[15px] font-semibold hover:border-brand hover:text-brand"
            >
              {t.common.previous}
            </Link>
          </li>
        ) : null}
        {pages.map((number) => (
          <li key={number}>
            <Link
              href={href(number)}
              aria-current={number === page ? "page" : undefined}
              className={cn(
                "grid h-10 min-w-10 place-items-center rounded-[4px] border px-3 font-ui text-[15px] font-semibold",
                number === page
                  ? "border-brand bg-brand text-white"
                  : "border-line hover:border-brand hover:text-brand",
              )}
            >
              {number}
            </Link>
          </li>
        ))}
        {page < totalPages ? (
          <li>
            <Link
              href={href(page + 1)}
              rel="next"
              className="grid h-10 min-w-10 place-items-center rounded-[4px] border border-line px-3 text-[15px] font-semibold hover:border-brand hover:text-brand"
            >
              {t.common.next}
            </Link>
          </li>
        ) : null}
      </ol>
    </nav>
  );
}

/** Friendly empty state + latest stories — FR-C4. */
export function EmptyCategory({ fallback }: { fallback: Story[] }) {
  return (
    <div className="py-6">
      <p className="text-[17px] font-semibold">{t.pages.emptyCategory}</p>
      <p className="mb-5 mt-1 text-[15px] text-meta">
        {t.pages.emptyCategoryHelp}
      </p>
      <StoryList stories={fallback} withLead={false} adPlacement="empty" />
    </div>
  );
}
