import Link from "next/link";

import { HugeiconsIcon, NewspaperIcon } from "@/components/icons";
import { Logo } from "@/components/layout/logo";
import { AdSlot } from "@/components/news/ad-slot";
import { Container } from "@/components/news/primitives";
import { t } from "@/lib/i18n";

/**
 * Desktop masthead — DESIGN.md §4.2: logo left, 728×90 ad centre, newsletter
 * CTA and e-paper link right. The ad box reserves its height, so nothing
 * below it moves when an ad loads (AD-2).
 */
export function Masthead() {
  return (
    <div className="hidden lg:block">
      <Container className="flex h-[108px] items-center justify-between gap-6">
        <Logo />
        <AdSlot size="728x90" placement="masthead" />
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/newsletter"
            className="rounded-[4px] bg-brand px-[18px] py-2.5 text-[15px] font-bold text-white hover:bg-brand-dark"
          >
            {t.common.subscribe}
          </Link>
          <Link
            href="/epaper"
            className="flex items-center gap-2 text-[14px] font-semibold text-ink hover:text-brand"
          >
            <HugeiconsIcon
              icon={NewspaperIcon}
              size={20}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            {t.common.todaysEpaper}
          </Link>
        </div>
      </Container>
    </div>
  );
}

/** Compact masthead used on article pages — DESIGN.md §6 (76px). */
export function CompactMasthead() {
  return (
    <div className="hidden lg:block">
      <Container className="flex h-[76px] items-center justify-between gap-6">
        <Logo size="mobile" showTagline={false} />
        <div className="flex items-center gap-[18px] text-[15px] font-semibold">
          <Link href="/search" className="hover:text-brand">
            {t.common.search}
          </Link>
          <Link href="/epaper" className="hover:text-brand">
            {t.common.epaper}
          </Link>
          <Link
            href="/newsletter"
            className="rounded-[4px] bg-brand px-4 py-2 text-white hover:bg-brand-dark"
          >
            {t.common.subscribeShort}
          </Link>
        </div>
      </Container>
    </div>
  );
}
