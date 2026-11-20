import Link from "next/link";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * SectionHeader — DESIGN.md §3.
 * 2px ink bottom rule, red tab on the left with a triangular notch, optional
 * sub-category links, and a "और पढ़ें →" link on the right.
 */
export function SectionHeader({
  title,
  href,
  moreLabel,
  moreHref,
  children,
  onDark = false,
  as: Heading = "h2",
  className,
}: {
  title: React.ReactNode;
  href?: string;
  moreLabel?: string;
  moreHref?: string;
  /** Sub-category links / tabs. */
  children?: React.ReactNode;
  onDark?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  const tab = (
    <Heading
      className={cn(
        "notch-r t-section-tab bg-brand px-4 pb-[2px] pt-1 text-white",
      )}
    >
      {title}
    </Heading>
  );

  return (
    <div
      className={cn(
        "mb-4 flex items-center justify-between gap-4 border-b-2",
        onDark ? "border-[#2d3c5e]" : "border-ink",
        className,
      )}
    >
      {href ? (
        <Link href={href} className="shrink-0">
          {tab}
        </Link>
      ) : (
        <div className="shrink-0">{tab}</div>
      )}

      {children ? (
        <div className="no-scrollbar ms-4 hidden flex-1 overflow-x-auto md:ms-9 md:block">
          {children}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {moreLabel && moreHref ? (
        <Link
          href={moreHref}
          className={cn(
            "shrink-0 whitespace-nowrap text-[14px] font-semibold",
            onDark ? "text-[#9fb3ff]" : "text-brand",
          )}
        >
          {moreLabel}
        </Link>
      ) : null}
    </div>
  );
}
