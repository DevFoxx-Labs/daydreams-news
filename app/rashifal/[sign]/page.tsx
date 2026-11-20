import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { getRashiSign, getRashiSigns } from "@/lib/cms";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiLongDate } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { rashiHref } from "@/lib/routes";

/** Single rashi page — FR-U2. */

export async function generateStaticParams() {
  const signs = await getRashiSigns();
  return signs.map((sign) => ({ sign: sign.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/rashifal/[sign]">): Promise<Metadata> {
  const { sign: slug } = await params;
  const sign = await getRashiSign(slug);
  if (!sign) return { title: t.pages.notFoundTitle };
  return {
    title: `${sign.name} राशिफल`,
    description: `${sign.name} (${sign.dates}) का आज का राशिफल। (डेमो कंटेंट)`,
    alternates: { canonical: rashiHref(sign.slug) },
  };
}

export default async function RashiPage({
  params,
}: PageProps<"/rashifal/[sign]">) {
  const { sign: slug } = await params;
  const [sign, signs] = await Promise.all([getRashiSign(slug), getRashiSigns()]);
  if (!sign) notFound();

  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <SectionHeader title={`${sign.name} राशिफल`} as="h1" />
        <div className="mb-6 flex items-start gap-4">
          <span
            className="glyph text-[48px] leading-none text-brand"
            aria-hidden="true"
          >
            {sign.glyph}
          </span>
          <div>
            <p className="text-[14px] text-muted">{sign.dates}</p>
            <p className="text-[14px] text-muted">{hindiLongDate(MOCK_NOW_ISO)}</p>
          </div>
        </div>
        <p className="mb-8 max-w-[70ch] text-[17px] leading-[1.8] lg:text-[19px]">
          {sign.today}
        </p>

        <h2 className="mb-3 text-[18px] font-extrabold">सभी राशियां</h2>
        <ul className="grid grid-cols-3 gap-2 pb-10 sm:grid-cols-6">
          {signs.map((other) => (
            <li key={other.slug}>
              <Link
                href={rashiHref(other.slug)}
                className="flex min-h-11 items-center justify-center rounded-[6px] border border-line px-2 py-2 text-[14px] font-semibold hover:border-brand hover:text-brand"
              >
                {other.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </SiteShell>
  );
}
