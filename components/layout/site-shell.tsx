import { Suspense } from "react";
import type * as React from "react";

import { Footer } from "@/components/layout/footer";
import { CompactMasthead, Masthead } from "@/components/layout/masthead";
import { MainNav, MobileNavChips } from "@/components/layout/main-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import {
  MobileTabBar,
  MobileTabBarSpacer,
} from "@/components/layout/mobile-tab-bar";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Ticker } from "@/components/news/ticker";
import { TrendingTags } from "@/components/news/trending-tags";
import {
  getAllCategories,
  getFeaturedStates,
  getNavCategories,
  getStates,
  getTicker,
  getTrendingTags,
} from "@/lib/cms";

/**
 * Global chrome — DESIGN.md §4.
 *
 * `full`    list pages: utility bar + 108px masthead + nav + ticker + trending
 * `reading` article / live blog: 76px compact masthead + nav (§6)
 * `bare`    web-story player and other full-screen surfaces
 */
export async function SiteShell({
  children,
  variant = "full",
  showTabBar = true,
}: {
  children: React.ReactNode;
  variant?: "full" | "reading" | "bare";
  showTabBar?: boolean;
}) {
  if (variant === "bare") {
    return <main id="main">{children}</main>;
  }

  const [navCategories, allCategories, states, featured, ticker, trending] =
    await Promise.all([
      getNavCategories(),
      getAllCategories(),
      getStates(),
      getFeaturedStates(),
      getTicker(),
      getTrendingTags(),
    ]);

  const moreCategories = allCategories.filter(
    (category) => !category.inNav && category.slug !== "rajya",
  );

  return (
    <>
      <header>
        {variant === "full" ? (
          <>
            <UtilityBar />
            <Masthead />
          </>
        ) : (
          <CompactMasthead />
        )}
        <MobileHeader
          categories={allCategories}
          states={featured}
          variant={variant === "reading" ? "reading" : "full"}
        />
        {/*
          The nav highlights the current section, which needs `usePathname()`.
          On routes whose path isn't known at build time (an open-ended tag
          page, say) that value only exists at request time, so the bars stream
          in behind placeholders of exactly the same height — no layout shift,
          and the rest of the page still prerenders.
        */}
        <Suspense fallback={<div className="hidden h-12 bg-brand lg:block" />}>
          <MainNav
            navCategories={navCategories}
            moreCategories={moreCategories}
            states={states}
          />
        </Suspense>
        {variant === "full" ? (
          <Suspense fallback={<div className="h-[42px] bg-brand lg:hidden" />}>
            <MobileNavChips navCategories={navCategories} />
          </Suspense>
        ) : null}
        {variant === "full" ? (
          <>
            <Ticker items={ticker} />
            <TrendingTags tags={trending} />
          </>
        ) : null}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer />
      {showTabBar ? (
        <>
          <MobileTabBarSpacer />
          <Suspense fallback={null}>
            <MobileTabBar />
          </Suspense>
        </>
      ) : null}
    </>
  );
}
