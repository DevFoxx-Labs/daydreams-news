import Link from "next/link";

import { FontSizeControl } from "@/components/article/font-size-control";
import { ShareBar } from "@/components/article/share-bar";
import { GoogleIcon, HugeiconsIcon, WhatsappIcon } from "@/components/icons";
import { SectionHeader } from "@/components/news/section-header";
import { StackCard } from "@/components/news/story-card";
import type { Correction, Story } from "@/lib/data/types";
import { hindiDate, hindiDateTime } from "@/lib/format/hindiDate";
import { fill, t } from "@/lib/i18n";
import { authorHref, categoryHref, tagHref } from "@/lib/routes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Article furniture — DESIGN.md §6. */

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label={t.common.breadcrumb} className="py-4 text-[14px] font-medium text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 ? <span aria-hidden="true">›</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "hover:text-brand",
                  index === items.length - 1 && "font-bold text-brand",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** मुख्य बातें — FR-A1 (0–5 bullets). */
export function Highlights({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <aside
      aria-labelledby="highlights-heading"
      className="mb-5 border-s-4 border-brand bg-brand-tint px-3.5 py-3.5 lg:px-[18px]"
    >
      <h2
        id="highlights-heading"
        className="mb-1.5 text-[14px] font-extrabold text-brand lg:text-[16px]"
      >
        {t.article.highlights}
      </h2>
      <ul className="list-disc space-y-1 ps-4">
        {items.slice(0, 5).map((item) => (
          <li
            key={item}
            className="text-[14.5px] font-medium leading-[1.55] lg:text-[16.5px] lg:leading-[1.6]"
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Byline row with the font-size control and share bar. */
export function Byline({
  story,
  url,
}: {
  story: Story;
  /** Absolute URL, built on the server for the share links. */
  url: string;
}) {
  const author = story.authors[0];
  const initials = author.name.slice(0, 2);
  const updated = story.updatedAt ?? story.publishedAt;

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3.5">
      <div className="flex items-center gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f3d5da] text-[16px] font-extrabold text-brand lg:size-[46px] lg:text-[20px]"
          aria-hidden="true"
        >
          {initials}
        </span>
        <div>
          <Link
            href={authorHref(author.slug)}
            className="block text-[14px] font-bold hover:text-brand lg:text-[16px]"
          >
            {author.name}
          </Link>
          <span className="block text-[12px] text-muted lg:text-[13.5px]">
            {story.dateline ? `${story.dateline} · ` : ""}
            {story.updatedAt ? t.article.updated : t.article.published}{" "}
            {hindiDateTime(updated)}
            {story.readMinutes
              ? ` · ${fill(t.time.readMinutes, { n: story.readMinutes })}`
              : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FontSizeControl className="hidden md:flex" />
        <ShareBar url={url} title={story.title} className="hidden md:flex" />
      </div>
    </div>
  );
}

/** Tags — soft chips "# मौसम". */
export function ArticleTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <nav aria-label={t.article.tags} className="my-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={tagHref(tag.replace(/\s+/g, "-"))}
          className="rounded-[4px] bg-soft px-3 py-1.5 text-[14px] font-semibold hover:bg-brand-tint hover:text-brand"
        >
          # {tag}
        </Link>
      ))}
    </nav>
  );
}

/** Follow box — navy, Google News + WhatsApp. */
export function FollowBox() {
  const links = [
    {
      href: site.social.googleNews,
      label: t.article.googleNews,
      icon: GoogleIcon,
    },
    {
      href: site.social.whatsappChannel,
      label: t.article.whatsappChannel,
      icon: WhatsappIcon,
    },
  ].filter((link) => link.href && link.href !== "#");

  if (links.length === 0) return null;

  return (
    <aside className="mb-8 flex flex-col gap-3 rounded-[8px] bg-navy px-5 py-4 text-white md:flex-row md:items-center md:justify-between">
      <b className="text-[17px] font-bold lg:text-[19px]">
        {site.name} {t.article.followOn}
      </b>
      <div className="flex gap-2.5">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-[4px] bg-white px-3.5 py-2 text-[14px] font-bold text-navy"
          >
            <HugeiconsIcon icon={link.icon} size={16} strokeWidth={2} />
            {link.label}
          </a>
        ))}
      </div>
    </aside>
  );
}

/** संबंधित ख़बरें — FR-A8. */
export function RelatedStories({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="mb-10">
      <SectionHeader
        title={t.article.related}
        moreLabel={t.common.more}
        moreHref={categoryHref(stories[0].category.slug)}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <StackCard key={story.id} story={story} showTime />
        ))}
      </div>
    </section>
  );
}

/** Correction note — FR-A4. */
export function Corrections({ corrections }: { corrections: Correction[] }) {
  if (corrections.length === 0) return null;
  return (
    <section
      aria-labelledby="corrections-heading"
      className="my-6 rounded-[6px] border border-line bg-soft p-4"
    >
      <h2 id="corrections-heading" className="mb-1.5 text-[15px] font-extrabold">
        {t.article.correction}
      </h2>
      <ul className="space-y-2">
        {corrections.map((correction) => (
          <li key={correction.correctedAt} className="text-[15px] leading-[1.6]">
            {correction.text}
            <span className="ms-1 text-muted">
              ({hindiDate(correction.correctedAt)})
            </span>
          </li>
        ))}
      </ul>
      <Link href="/ethics" className="mt-2 inline-block text-[14px] font-semibold text-brand">
        {t.legal.ethics}
      </Link>
    </section>
  );
}
