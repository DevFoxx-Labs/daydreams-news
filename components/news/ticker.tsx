import Link from "next/link";

import { FlashIcon, HugeiconsIcon } from "@/components/icons";
import { Container } from "@/components/news/primitives";
import type { TickerItem } from "@/lib/data/types";
import { t } from "@/lib/i18n";

/**
 * Breaking ticker — DESIGN.md §3 / §4.4, FR-G2.
 *
 * Black "⚡ ब्रेकिंग" label with a notch, then a CSS marquee of headlines
 * separated by red dots. Pauses on hover and on keyboard focus (the links are
 * focusable, so `:focus-within` covers keyboard users), and
 * `prefers-reduced-motion` turns it into a static, scrollable list.
 *
 * Hidden entirely when there is nothing active (FR-G2).
 */
export function Ticker({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null;

  const list = (
    <>
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="shrink-0 text-[13.5px] font-medium text-ink before:me-2 before:align-[3px] before:text-[9px] before:text-brand before:content-['●'] hover:text-brand lg:text-[15.5px]"
        >
          {item.text}
        </Link>
      ))}
    </>
  );

  return (
    <section
      aria-label={t.ticker.region}
      className="border-b border-line bg-white"
    >
      <Container className="flex h-11 items-center gap-3 lg:gap-4">
        <span className="notch-r me-2 flex h-[26px] shrink-0 items-center gap-1.5 bg-ink px-2.5 text-[12px] font-extrabold text-white lg:h-[30px] lg:px-3.5 lg:text-[15px]">
          <HugeiconsIcon
            icon={FlashIcon}
            size={14}
            strokeWidth={2}
            aria-hidden="true"
          />
          {t.ticker.label}
        </span>

        {/* Animated marquee: the list is duplicated so the loop is seamless. */}
        <div className="ks-marquee-root relative hidden min-w-0 flex-1 overflow-hidden motion-safe:block">
          <div className="ks-marquee-track flex w-max items-center gap-[30px]">
            {list}
            <span aria-hidden="true" className="flex items-center gap-[30px]">
              {list}
            </span>
          </div>
        </div>

        {/* Reduced motion / no-JS: a plain scrollable row. */}
        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-[30px] overflow-x-auto motion-safe:hidden">
          {list}
        </div>
      </Container>
    </section>
  );
}
