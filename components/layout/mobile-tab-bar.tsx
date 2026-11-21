"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Album02Icon,
  Home01Icon,
  HugeiconsIcon,
  NewspaperIcon,
  PlayCircleIcon,
  UserCircleIcon,
} from "@/components/icons";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Mobile bottom tab bar — DESIGN.md §4.5.
 *
 * Hidden on article pages (the fixed share bar takes its place) and inside the
 * web-story player. Safe-area padding keeps it clear of the home indicator.
 */
const TABS = [
  { href: "/", label: t.common.home, icon: Home01Icon },
  { href: "/web-stories", label: t.common.stories, icon: Album02Icon },
  { href: "/videos", label: t.common.video, icon: PlayCircleIcon },
  { href: "/epaper", label: t.common.epaper, icon: NewspaperIcon },
  { href: "/consent", label: t.common.profile, icon: UserCircleIcon },
];

/** Routes that replace the tab bar with their own bottom chrome. */
const HIDDEN_PREFIXES = ["/web-stories/", "/photos/"];

export function MobileTabBar() {
  const pathname = usePathname();

  const isArticle = /^\/[a-z0-9-]+\/[a-z0-9-]+-\d+$/.test(pathname);
  const hidden =
    isArticle || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (hidden) return null;

  return (
    <nav
      aria-label={t.nav.mainNav}
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white px-1 pb-[max(14px,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-col items-center gap-0.5 text-[11px] font-semibold",
              active ? "text-brand" : "text-meta",
            )}
          >
            <HugeiconsIcon
              icon={tab.icon}
              size={22}
              strokeWidth={active ? 2 : 1.6}
              aria-hidden="true"
            />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Spacer so fixed bottom chrome never covers the last line of content. */
export function MobileTabBarSpacer() {
  return <div className="h-[76px] lg:hidden" aria-hidden="true" />;
}
