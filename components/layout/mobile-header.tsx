import Link from "next/link";

import { BackButton } from "@/components/layout/back-button";
import { FontSizeControl } from "@/components/article/font-size-control";
import { HugeiconsIcon, Notification03Icon, Search01Icon } from "@/components/icons";
import { Logo, LogoMark } from "@/components/layout/logo";
import { MobileMenuSheet } from "@/components/layout/mobile-menu-sheet";
import type { Category, IndianState } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { flags } from "@/lib/site";

/**
 * Mobile header — DESIGN.md §4.2 and §6.
 *
 * `full`    sticky 56px bar: logo + search / bell / menu
 * `reading` article and live pages: ← back · logo mark · font size
 *
 * The notification bell only appears once web push is enabled (FR-E2), so no
 * button here does nothing.
 */
export function MobileHeader({
  categories,
  states,
  variant = "full",
}: {
  categories: Category[];
  states: IndianState[];
  variant?: "full" | "reading";
}) {
  if (variant === "reading") {
    return (
      <header className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-2">
          <BackButton />
          <LogoMark className="!size-7 !text-[19px]" />
          <FontSizeControl className="!h-9" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Logo size="mobile" showTagline={false} />
        <div className="flex items-center">
          <Link
            href="/search"
            aria-label={t.common.search}
            className="grid size-11 place-items-center text-ink"
          >
            <HugeiconsIcon icon={Search01Icon} size={22} strokeWidth={1.8} />
          </Link>
          {flags.webPush ? (
            <Link
              href="/notifications"
              aria-label={t.common.notifications}
              className="grid size-11 place-items-center text-ink"
            >
              <HugeiconsIcon icon={Notification03Icon} size={22} strokeWidth={1.8} />
            </Link>
          ) : null}
          <MobileMenuSheet categories={categories} states={states} />
        </div>
      </div>
    </header>
  );
}
