import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { ArticleBody } from "@/components/article/article-body";
import { hindiDate } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { legalNoticeBySlug, type LegalSlug } from "@/lib/legal/notices";

/**
 * Shared renderer for the legal and static pages (§6.12).
 * One source (`lib/legal/notices.ts`) feeds the website and `/api/legal`, so
 * the texts cannot drift between the site and the apps.
 */

export function legalMetadata(slug: LegalSlug): Metadata {
  const notice = legalNoticeBySlug[slug];
  return {
    title: notice.title,
    description: notice.summary,
    alternates: { canonical: `/${notice.slug}` },
  };
}

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const notice = legalNoticeBySlug[slug];

  return (
    <SiteShell variant="full">
      <Container className="max-w-[820px] pb-12 pt-5">
        <SectionHeader title={notice.title} as="h1" />
        <p className="mb-2 text-[16px] leading-[1.6] text-ink-2">
          {notice.summary}
        </p>
        <p className="mb-6 text-[13.5px] text-meta">
          {t.legal.version} {notice.version} · {t.legal.lastUpdated}{" "}
          {hindiDate(`${notice.lastUpdated}T00:00:00+05:30`)}
        </p>

        {notice.draft ? (
          <p className="mb-6 rounded-[6px] border border-brand-line bg-brand-tint p-3.5 text-[14px] leading-[1.6] text-ink-2">
            ⚠️ {t.legal.lawyerNote}
          </p>
        ) : null}

        <ArticleBody
          blocks={notice.body}
          readAlsoStories={{}}
          autoReadAlso={null}
          insertAds={false}
        />
      </Container>
    </SiteShell>
  );
}
