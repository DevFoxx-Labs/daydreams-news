import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { getRashiSigns } from "@/lib/cms";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiLongDate } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { rashiHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** राशिफल index — FR-U2. */

export const metadata: Metadata = {
  title: t.home.rashifal,
  description: `सभी 12 राशियों का आज का राशिफल — ${site.name} पर। (डेमो कंटेंट)`,
  alternates: { canonical: "/rashifal" },
};

export default async function RashifalPage() {
  const signs = await getRashiSigns();

  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <SectionHeader title={t.home.rashifal} as="h1" />
        <p className="mb-5 text-[15px] text-meta">
          {hindiLongDate(MOCK_NOW_ISO)}
        </p>
        <ul className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 lg:grid-cols-4">
          {signs.map((sign) => (
            <li key={sign.slug}>
              <Link
                href={rashiHref(sign.slug)}
                className="block h-full rounded-[8px] border border-line p-4 hover:border-brand"
              >
                <span
                  className="glyph mb-1 block text-[30px] leading-none text-brand"
                  aria-hidden="true"
                >
                  {sign.glyph}
                </span>
                <h2 className="text-[17px] font-bold">{sign.name}</h2>
                <p className="text-[13px] text-meta">{sign.dates}</p>
                <p className="clamp-3 mt-2 text-[14.5px] leading-[1.55] text-ink-2">
                  {sign.today}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </SiteShell>
  );
}
