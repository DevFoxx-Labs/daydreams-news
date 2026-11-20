"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowRight01Icon,
  HugeiconsIcon,
  Menu01Icon,
  Search01Icon,
} from "@/components/icons";
import { Logo } from "@/components/layout/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category, IndianState } from "@/lib/data/types";
import { useClientStore } from "@/lib/client-store";
import { t } from "@/lib/i18n";
import { setStatePreference, stateStore } from "@/lib/preference-stores";
import { categoryHref, stateHref } from "@/lib/routes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Full-screen mobile menu — DESIGN.md §4.6.
 *
 * Search field, "अपना राज्य चुनें" 3-column grid (the choice is saved in a
 * cookie and personalises the home state block, FR-H3), the category list and
 * the language toggle.
 */
export function MobileMenuSheet({
  categories,
  states,
}: {
  categories: Category[];
  states: IndianState[];
}) {
  const [open, setOpen] = useState(false);
  const selectedState = useClientStore(stateStore);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t.common.menu}
        className="grid size-11 place-items-center text-ink"
      >
        <HugeiconsIcon icon={Menu01Icon} size={22} strokeWidth={1.8} />
      </SheetTrigger>

      <SheetContent side="right" showClose={false} className="lg:max-w-[420px]">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <SheetTitle asChild>
            <div>
              <Logo size="mobile" showTagline={false} />
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t.nav.categories}
          </SheetDescription>
          <button
            type="button"
            aria-label={t.common.close}
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center text-[22px] text-ink"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="my-3.5 flex items-center gap-2 rounded-[8px] border border-[#ddd] px-3.5 py-3 text-[15px] text-muted"
          >
            <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={1.8} />
            {t.common.searchPlaceholder}
          </Link>

          <h3 className="mb-1.5 mt-2.5 text-[13px] font-extrabold tracking-[0.5px] text-muted">
            {t.nav.chooseState}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {states.map((state) => (
              <button
                key={state.slug}
                type="button"
                onClick={() => setStatePreference(state.slug)}
                aria-pressed={selectedState === state.slug}
                className={cn(
                  "min-h-11 rounded-[6px] border border-line px-1 py-2.5 text-center text-[14px] font-semibold",
                  selectedState === state.slug
                    ? "border-brand bg-brand text-white"
                    : "text-ink",
                )}
              >
                {state.name}
              </button>
            ))}
          </div>
          <Link
            href={stateHref(selectedState)}
            onClick={() => setOpen(false)}
            className="mt-2.5 inline-block text-[14px] font-semibold text-brand"
          >
            {t.common.readMore}
          </Link>

          <h3 className="mb-1.5 mt-5 text-[13px] font-extrabold tracking-[0.5px] text-muted">
            {t.nav.categories}
          </h3>
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={categoryHref(category.slug)}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-between border-b border-line py-2 text-[17px] font-bold text-ink"
                >
                  {category.name}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    strokeWidth={2}
                    className="text-muted"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3.5 flex gap-2">
            <span className="flex-1 rounded-[6px] border border-ink bg-ink py-2.5 text-center text-[14px] font-bold text-white">
              {t.common.hindi}
            </span>
            {site.englishEditionUrl ? (
              <a
                href={site.englishEditionUrl}
                hrefLang="en"
                className="flex-1 rounded-[6px] border border-ink py-2.5 text-center text-[14px] font-bold text-ink"
              >
                {t.common.english}
              </a>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13.5px] text-muted">
            <Link href="/about">{t.legal.about}</Link>
            <Link href="/privacy">{t.legal.privacy}</Link>
            <Link href="/consent">{t.legal.consent}</Link>
            <Link href="/grievance">{t.legal.grievance}</Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
