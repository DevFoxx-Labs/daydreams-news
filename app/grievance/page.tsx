import type { Metadata } from "next";

import { ArticleBody } from "@/components/article/article-body";
import { PrivacyRequestForm } from "@/components/consent/privacy-request-form";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { hindiDate } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { legalNoticeBySlug } from "@/lib/legal/notices";
import { site } from "@/lib/site";

/** Grievance redressal + rights request form — DPDP s.13, IT Rules 2021. */

const notice = legalNoticeBySlug.grievance;

export const metadata: Metadata = {
  title: notice.title,
  description: notice.summary,
  alternates: { canonical: "/grievance" },
};

export default function GrievancePage() {
  const officer = site.legal.grievanceOfficer;

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

        <aside className="mb-7 rounded-[6px] border border-line bg-soft p-4">
          <h2 className="mb-1.5 text-[16px] font-extrabold">
            {officer.designation}
          </h2>
          <dl className="space-y-1 text-[15px] leading-[1.6]">
            <div className="flex gap-2">
              <dt className="font-semibold">नाम:</dt>
              <dd>{officer.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">ईमेल:</dt>
              <dd>{officer.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">फ़ोन:</dt>
              <dd>{officer.phone}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">समय-सीमा:</dt>
              <dd>
                पुष्टि {officer.acknowledgeHours} घंटे में · निपटारा{" "}
                {officer.resolveDays} दिन में
              </dd>
            </div>
          </dl>
        </aside>

        <section aria-labelledby="request-form" className="mb-8">
          <h2 id="request-form" className="mb-3 text-[20px] font-extrabold">
            {t.consent.makeRequest}
          </h2>
          <PrivacyRequestForm />
        </section>

        <ArticleBody
          blocks={notice.body}
          readAlsoStories={{}}
          autoReadAlso={null}
          insertAds={false}
        />

        {notice.draft ? (
          <p className="mt-6 rounded-[6px] border border-brand-line bg-brand-tint p-3.5 text-[14px] leading-[1.6] text-ink-2">
            ⚠️ {t.legal.lawyerNote}
          </p>
        ) : null}
      </Container>
    </SiteShell>
  );
}
