import Link from "next/link";

import {
  ChartDownIcon,
  ChartUpIcon,
  HugeiconsIcon,
} from "@/components/icons";
import {
  DemoLabel,
  LiveBadge,
  SideHeading,
} from "@/components/news/primitives";
import { NumberedCard } from "@/components/news/story-card";
import type { LiveBlog, Story } from "@/lib/data/types";
import { istClock, istClock24 } from "@/lib/format/hindiDate";
import { indianNumber, rupees, signedPercent } from "@/lib/format/number";
import { t } from "@/lib/i18n";
import { liveHref, storyHref } from "@/lib/routes";
import type { Market, Scorecard, ServiceResult } from "@/lib/services/types";
import { cn } from "@/lib/utils";

/**
 * Homepage rail widgets — DESIGN.md §5.1, §5.3, §5.5.
 * Every service-backed widget shows an "अपडेटेड <time>" stamp and, while it
 * is on mock data, a "डेमो" label (FR-H7).
 */

/** LiveUpdates box — 4 latest updates of the featured live blog (FR-H2). */
export function LiveUpdatesBox({
  liveBlog,
  fallbackStories,
}: {
  liveBlog: LiveBlog | null;
  fallbackStories: Story[];
}) {
  const entries = liveBlog
    ? liveBlog.updates.slice(0, 4).map((update) => ({
        key: update.id,
        clock: istClock24(update.time),
        title: update.title,
        href: liveHref(liveBlog.slug),
      }))
    : fallbackStories.slice(0, 4).map((story) => ({
        key: story.id,
        clock: istClock24(story.publishedAt),
        title: story.title,
        href: storyHref(story),
      }));

  if (entries.length === 0) return null;

  return (
    <section
      aria-labelledby="live-updates-heading"
      className="mb-4 rounded-[4px] border border-line border-t-[3px] border-t-brand px-4 py-3.5"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <h2 id="live-updates-heading" className="text-[18px] font-extrabold">
          {t.home.liveUpdates}
        </h2>
        <LiveBadge />
      </div>
      <ol>
        {entries.map((entry, index) => (
          <li
            key={entry.key}
            className={cn(
              "relative grid grid-cols-[54px_1fr] gap-2.5 py-2.5",
              index < entries.length - 1 && "border-b border-dashed border-line",
            )}
          >
            <span className="font-ui text-[13px] font-bold text-brand">
              {entry.clock}
            </span>
            <span
              className="absolute left-[44px] top-[15px] size-[7px] rounded-full bg-brand"
              aria-hidden="true"
            />
            <Link
              href={entry.href}
              className="text-[15px] font-semibold leading-snug hover:text-brand"
            >
              {entry.title}
            </Link>
          </li>
        ))}
      </ol>
      {liveBlog ? (
        <Link
          href={liveHref(liveBlog.slug)}
          className="mt-1 inline-block text-[14px] font-semibold text-brand"
        >
          {t.common.readMore}
        </Link>
      ) : null}
    </section>
  );
}

/** Most read — FR-H4. */
export function MostRead({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;
  return (
    <section aria-labelledby="most-read-heading">
      <SideHeading>
        <span id="most-read-heading">{t.home.mostRead}</span>
      </SideHeading>
      {stories.map((story, index) => (
        <NumberedCard
          key={story.id}
          story={story}
          index={index + 1}
          last={index === stories.length - 1}
        />
      ))}
    </section>
  );
}

/** Trending list used in the article rail — 5 numbered items. */
export function TrendingList({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;
  return (
    <section aria-labelledby="trending-heading">
      <SideHeading>
        <span id="trending-heading">{t.home.trending}</span>
      </SideHeading>
      {stories.map((story, index) => (
        <NumberedCard
          key={story.id}
          story={story}
          index={index + 1}
          last={index === stories.length - 1}
        />
      ))}
    </section>
  );
}

/** Cricket scorecard — navy gradient card (DESIGN.md §5.5). */
export function ScoreCard({ result }: { result: ServiceResult<Scorecard> }) {
  const { data, updatedAt, isDemo } = result;
  return (
    <section
      aria-label={t.widgets.scorecard}
      className="mb-4 rounded-[6px] border border-line bg-[linear-gradient(135deg,#0f1b33,#1d3461)] p-3.5 text-white"
    >
      <div className="mb-2.5 flex items-center justify-between gap-2 text-[12px] font-semibold text-[#b9c6e4]">
        <span>{data.matchLabel}</span>
        <span className="flex items-center gap-2">
          {isDemo ? <DemoLabel className="!border-white/30 !bg-white/10 !text-white" /> : null}
          {data.status === "live" ? <LiveBadge className="!text-[10px]" /> : null}
        </span>
      </div>
      {data.teams.map((team) => (
        <div
          key={team.name}
          className="flex items-center justify-between py-1.5"
        >
          <b className="flex items-center gap-2.5 text-[17px] font-bold">
            <i
              className="inline-block h-[18px] w-[26px] rounded-[2px]"
              style={{ background: team.chip }}
              aria-hidden="true"
            />
            {team.name}
          </b>
          <span className="font-ui text-[18px] font-bold">
            {team.score}
            {team.overs ? (
              <small className="ms-1 text-[12px] font-medium text-[#b9c6e4]">
                ({team.overs})
              </small>
            ) : null}
          </span>
        </div>
      ))}
      <p className="mt-1.5 text-[13px] font-medium text-[#ffd166]">
        {data.statusLine}
      </p>
      <p className="mt-1 font-ui text-[11px] text-[#9fb3d9]">
        {t.common.updatedAt} {istClock(updatedAt)}
      </p>
    </section>
  );
}

/** Market snapshot — FR-U4, with the delay disclosed. */
export function MarketWidget({ result }: { result: ServiceResult<Market> }) {
  const { data, updatedAt, isDemo } = result;
  return (
    <section aria-labelledby="market-heading" className="mb-4">
      <SideHeading>
        <span id="market-heading">{t.home.market}</span>
      </SideHeading>
      <div className="overflow-hidden rounded-[6px] border border-line">
        {data.rows.map((row) => {
          const up = row.changePercent >= 0;
          return (
            <div
              key={row.key}
              className="flex items-center justify-between border-b border-line px-3.5 py-2.5 text-[15px] font-semibold last:border-b-0"
            >
              <span>{row.label}</span>
              <span className={up ? "text-up" : "text-down"}>
                {row.isCurrency ? rupees(row.value) : indianNumber(row.value)}
                <small className="ms-2 inline-flex items-center gap-0.5 font-ui text-[13px] font-medium">
                  <HugeiconsIcon
                    icon={up ? ChartUpIcon : ChartDownIcon}
                    size={12}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                  {signedPercent(row.changePercent).replace(/^[▲▼]\s/, "")}
                </small>
              </span>
            </div>
          );
        })}
        <p className="flex flex-wrap items-center gap-2 px-3.5 py-2 text-[12px] text-meta">
          {isDemo ? <DemoLabel /> : null}
          <span>
            {t.widgets.marketDelay} · {t.common.updatedAt} {istClock(updatedAt)}
          </span>
        </p>
      </div>
    </section>
  );
}
