"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowDown01Icon,
  Home01Icon,
  HugeiconsIcon,
  Menu01Icon,
  Search01Icon,
} from "@/components/icons";
import { Container } from "@/components/news/primitives";
import type { Category, IndianState } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { categoryHref, stateHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Desktop main nav — DESIGN.md §4.3.
 *
 * Full-width brand bar. "राज्य ▾" opens a 4-column mega menu of states with
 * their top cities; "और ▾" lists the remaining sections. Both open on hover
 * **and** on keyboard focus (`focus-within`), so no JavaScript is needed to
 * operate them.
 */
export function MainNav({
  navCategories,
  moreCategories,
  states,
}: {
  navCategories: Category[];
  moreCategories: Category[];
  states: IndianState[];
}) {
  const pathname = usePathname();
  const isActive = (slug: string) =>
    pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);

  // Tighter spacing between 1024 and 1279px so all sixteen items fit without
  // a horizontal page scroll (acceptance: no overflow at any breakpoint).
  const itemClass =
    "flex h-12 items-center whitespace-nowrap px-2 text-[15px] font-semibold text-white hover:bg-brand-dark xl:px-[13px] xl:text-[16.5px]";

  return (
    <nav
      aria-label={t.nav.mainNav}
      className="relative hidden bg-brand lg:block"
    >
      <Container className="flex h-12 items-center">
        <Link
          href="/"
          aria-label={t.common.home}
          className={cn(itemClass, "px-4", pathname === "/" && "bg-brand-dark")}
        >
          <HugeiconsIcon icon={Home01Icon} size={20} strokeWidth={1.8} />
        </Link>

        {navCategories.slice(0, 2).map((category) => (
          <Link
            key={category.slug}
            href={categoryHref(category.slug)}
            className={cn(itemClass, isActive(category.slug) && "bg-brand-dark")}
          >
            {category.name}
          </Link>
        ))}

        {/* राज्य ▾ — mega menu */}
        <div className="group relative">
          <Link
            href="/state"
            className={cn(
              itemClass,
              "gap-1",
              pathname.startsWith("/state") && "bg-brand-dark",
            )}
          >
            {t.nav.states}
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2} />
          </Link>
          <div
            // `hidden` rather than `invisible`: an invisible panel still takes
            // part in layout and would push the page wider than the viewport.
            className={cn(
              "absolute start-0 top-12 z-40 hidden w-[min(1000px,calc(100vw-2rem))] shadow-lg",
              "group-hover:block group-focus-within:block",
            )}
          >
            <div className="grid grid-cols-4 gap-x-6 gap-y-4 border border-line bg-white p-5">
              {states.slice(0, 16).map((state) => (
                <div key={state.slug}>
                  <Link
                    href={stateHref(state.slug)}
                    className="block text-[15.5px] font-bold text-ink hover:text-brand"
                  >
                    {state.name}
                  </Link>
                  <ul className="mt-1 space-y-0.5">
                    {state.cities.slice(0, 3).map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={stateHref(state.slug, city.slug)}
                          className="text-[13.5px] text-meta hover:text-brand"
                        >
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {navCategories.slice(2, 12).map((category) => (
          <Link
            key={category.slug}
            href={categoryHref(category.slug)}
            className={cn(itemClass, isActive(category.slug) && "bg-brand-dark")}
          >
            {category.name}
          </Link>
        ))}

        {/* और ▾ — remaining sections */}
        {moreCategories.length > 0 ? (
          <div className="group relative">
            <button type="button" className={cn(itemClass, "gap-1")}>
              {t.nav.moreSections}
              <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2} />
            </button>
            <div
              className={cn(
                "absolute end-0 top-12 z-40 hidden w-[220px] shadow-lg",
                "group-hover:block group-focus-within:block",
              )}
            >
              <ul className="border border-line bg-white py-2">
                {moreCategories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={categoryHref(category.slug)}
                      className="block px-4 py-2 text-[15.5px] font-semibold text-ink hover:bg-soft hover:text-brand"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="ms-auto flex items-center gap-1">
          <Link
            href="/search"
            aria-label={t.common.search}
            className={cn(itemClass, "px-3")}
          >
            <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.8} />
          </Link>
          {/* Full section index — the desktop equivalent of the mobile sheet. */}
          <Link
            href="/sitemap"
            aria-label={t.legal.sitemap}
            className={cn(itemClass, "px-3")}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.8} />
          </Link>
        </div>
      </Container>
    </nav>
  );
}

/** Mobile nav chips — DESIGN.md §4.3 (scrollable red chip bar). */
export function MobileNavChips({ navCategories }: { navCategories: Category[] }) {
  const pathname = usePathname();
  const items = [
    { href: "/", label: t.common.home },
    ...navCategories.slice(0, 10).map((c) => ({
      href: categoryHref(c.slug),
      label: c.name,
    })),
  ];

  return (
    <nav
      aria-label={t.nav.mainNav}
      className="no-scrollbar flex snap-x gap-1.5 overflow-x-auto bg-brand px-4 lg:hidden"
    >
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "snap-start whitespace-nowrap px-2 py-2.5 text-[15px] font-semibold text-white",
              active && "border-b-[3px] border-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
