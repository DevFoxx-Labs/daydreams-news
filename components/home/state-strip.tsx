"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { Container } from "@/components/news/primitives";
import { useClientStore } from "@/lib/client-store";
import type { IndianState } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { setStatePreference, stateStore } from "@/lib/preference-stores";
import { stateHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * State strip — DESIGN.md §5.2, FR-H3.
 *
 * Shows the reader's saved state first. Choosing a state swaps the block
 * without a full page reload (`/api/state-feed`) and saves the choice in a
 * cookie for a year.
 */

type FeedStory = {
  id: string;
  title: string;
  href: string;
  category: string;
  timeAgo: string;
};

export function StateStrip({
  states,
  initialState,
  initialStories,
}: {
  states: IndianState[];
  initialState: string;
  initialStories: FeedStory[];
}) {
  const saved = useClientStore(stateStore);
  const active = states.some((s) => s.slug === saved) ? saved : initialState;

  const [feeds, setFeeds] = useState<Record<string, FeedStory[]>>({
    [initialState]: initialStories,
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const loading = useRef<string | null>(null);

  const load = useCallback(async (slug: string) => {
    if (loading.current === slug) return;
    loading.current = slug;
    try {
      const response = await fetch(`/api/state-feed?state=${slug}`);
      if (!response.ok) throw new Error("feed failed");
      const payload = (await response.json()) as { stories: FeedStory[] };
      startTransition(() => {
        setFeeds((current) => ({ ...current, [slug]: payload.stories }));
        setError(false);
      });
    } catch {
      startTransition(() => setError(true));
    } finally {
      loading.current = null;
    }
  }, []);

  // The server rendered the default state (keeping this section in the static
  // shell); fetch the reader's saved state once it is known.
  useEffect(() => {
    if (!feeds[active]) void load(active);
  }, [active, feeds, load]);

  function choose(slug: string) {
    if (slug === active) return;
    setStatePreference(slug);
    if (!feeds[slug]) void load(slug);
  }

  const stories = feeds[active] ?? [];
  const activeState = states.find((s) => s.slug === active);

  return (
    <section aria-labelledby="state-strip-heading" className="mb-6 lg:mb-8">
      <div className="bg-soft py-3.5 lg:py-[18px]">
        <Container className="no-scrollbar flex items-center gap-2.5 overflow-x-auto">
          <h2
            id="state-strip-heading"
            className="me-2.5 shrink-0 text-[17px] font-extrabold lg:text-[18px]"
          >
            {t.home.stateNews}
          </h2>
          {states.map((state) => (
            <button
              key={state.slug}
              type="button"
              onClick={() => choose(state.slug)}
              aria-pressed={active === state.slug}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-[4px] border px-3.5 py-[7px] text-[15px] font-semibold",
                active === state.slug
                  ? "border-brand bg-brand text-white"
                  : "border-[#ddd] bg-white text-ink hover:border-brand hover:text-brand",
              )}
            >
              {state.name}
            </button>
          ))}
        </Container>
      </div>

      <Container className="pt-4">
        {error ? (
          <p className="text-[15px] text-muted">{t.home.stateEmpty}</p>
        ) : stories.length === 0 ? (
          <p className="text-[15px] text-muted">{t.home.stateEmpty}</p>
        ) : (
          <ul
            aria-busy={pending}
            className={cn(
              "grid gap-x-6 gap-y-0 transition-opacity md:grid-cols-2 lg:grid-cols-3",
              pending && "opacity-60",
            )}
          >
            {stories.map((story) => (
              <li key={story.id} className="border-b border-line py-2.5">
                <Link href={story.href} className="group block">
                  <span className="t-category mb-0.5 block">{story.category}</span>
                  <span className="t-h-sm clamp-2 block group-hover:text-brand-dark">
                    {story.title}
                  </span>
                  <span className="t-meta mt-1 block">{story.timeAgo}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {activeState ? (
          <Link
            href={stateHref(activeState.slug)}
            className="mt-3 inline-block text-[14px] font-semibold text-brand"
          >
            {activeState.name} {t.common.readMore}
          </Link>
        ) : null}
      </Container>
    </section>
  );
}
