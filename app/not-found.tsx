import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { RowCard } from "@/components/news/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLatest } from "@/lib/cms";
import { t } from "@/lib/i18n";

/** 404 — DESIGN.md §7: logo, message, search box and the top 5 stories. */

export default async function NotFound() {
  const stories = await getLatest(5);

  return (
    <SiteShell variant="full">
      <Container className="max-w-[720px] pb-12 pt-8">
        <h1 className="mb-2 text-[26px] font-extrabold lg:text-[32px]">
          {t.pages.notFoundTitle}
        </h1>
        <p className="mb-5 text-[16px] leading-[1.7] text-ink-2">
          {t.pages.notFoundBody}
        </p>

        <form method="get" action="/search" className="mb-8 flex gap-2">
          <label htmlFor="nf-q" className="sr-only">
            {t.common.searchPlaceholder}
          </label>
          <Input
            id="nf-q"
            type="search"
            name="q"
            placeholder={t.common.searchPlaceholder}
            maxLength={120}
          />
          <Button type="submit" variant="brand" size="lg">
            {t.search.submit}
          </Button>
        </form>

        <h2 className="mb-2 text-[19px] font-extrabold">
          {t.pages.notFoundTopStories}
        </h2>
        {stories.map((story, index) => (
          <RowCard
            key={story.id}
            story={story}
            showTime
            last={index === stories.length - 1}
          />
        ))}

        <Link
          href="/"
          className="mt-6 inline-block text-[15px] font-semibold text-brand"
        >
          ← {t.common.home}
        </Link>
      </Container>
    </SiteShell>
  );
}
