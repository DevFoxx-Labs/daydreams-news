import Link from "next/link";
import type * as React from "react";

import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiTimeAgo, istIso } from "@/lib/format/hindiDate";
import { categoryHref, tagHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Page container — DESIGN.md §2.3. */
export function Container({
  className,
  as: Tag = "div",
  ...props
}: React.ComponentProps<"div"> & { as?: "div" | "section" | "header" | "footer" | "nav" }) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1280px] px-4 md:px-6 xl:px-0", className)}
      {...props}
    />
  );
}

/** CategoryLabel — brand red, bold, links to the category. */
export function CategoryLabel({
  name,
  slug,
  className,
  asLink = true,
}: {
  name: string;
  slug?: string;
  className?: string;
  asLink?: boolean;
}) {
  const classes = cn("t-category mb-1 block", className);
  if (!asLink || !slug) return <span className={classes}>{name}</span>;
  return (
    <Link href={categoryHref(slug)} className={cn(classes, "hover:underline")}>
      {name}
    </Link>
  );
}

/**
 * TimeAgo — "10 मिनट पहले" … then the absolute date.
 * Measured against the demo clock so the markup is deterministic; swap
 * `now` for the real clock when the CMS is connected.
 */
export function TimeAgo({
  value,
  now = MOCK_NOW_ISO,
  className,
}: {
  value: string;
  now?: string;
  className?: string;
}) {
  return (
    <time dateTime={istIso(value)} className={cn("t-meta", className)}>
      {hindiTimeAgo(value, now)}
    </time>
  );
}

/** LiveBadge — brand fill, Inter, pulsing dot (motion-safe). */
export function LiveBadge({
  label = "LIVE",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] bg-brand px-2 py-[3px]",
        "font-ui text-[12px] font-bold tracking-[0.5px] text-white",
        className,
      )}
    >
      <span className="size-[7px] rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.35)] motion-safe:animate-pulse" />
      {label}
    </span>
  );
}

/** TagChip — pill with the # in brand. */
export function TagChip({
  label,
  slug,
  className,
}: {
  label: string;
  slug?: string;
  className?: string;
}) {
  const inner = (
    <>
      <b className="font-bold text-brand">#</b>
      {label}
    </>
  );
  const classes = cn(
    "inline-flex items-center gap-1 rounded-[16px] border border-line bg-[#fafafa] px-3 py-1",
    "text-[14px] font-semibold text-ink-2 hover:border-brand hover:text-brand",
    className,
  );
  if (!slug) return <span className={classes}>{inner}</span>;
  return (
    <Link href={tagHref(slug)} className={classes}>
      {inner}
    </Link>
  );
}

/** SideHeading — 20px/800 with a 4px brand left bar (rail headings). */
export function SideHeading({
  children,
  className,
  onDark = false,
}: {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <h2
      className={cn(
        "mb-3 border-s-4 border-brand ps-2.5 text-[20px] font-extrabold leading-tight",
        onDark ? "text-white" : "text-ink",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Mobile "gutter bar" between blocks — DESIGN.md §2.3. */
export function GutterBar({ className }: { className?: string }) {
  return <div className={cn("h-2 bg-soft lg:hidden", className)} aria-hidden="true" />;
}

/** "प्रायोजित" label — FR-A9. */
export function SponsoredLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] bg-soft px-2 py-[2px] text-[12px] font-bold text-muted",
        className,
      )}
    >
      प्रायोजित
    </span>
  );
}

/** "डेमो" label for widgets still on mock data — FR-H7. */
export function DemoLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] border border-line bg-white px-1.5 py-[1px] font-ui text-[10px] font-bold uppercase tracking-wide text-muted",
        className,
      )}
    >
      डेमो
    </span>
  );
}
