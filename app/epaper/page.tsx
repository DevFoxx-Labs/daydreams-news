import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiLongDate } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * ई-पेपर — DESIGN.md §7.
 * The viewer itself is a Phase 3 item (PRD §5), so this page states what is
 * coming instead of showing a non-working reader.
 */

export const metadata: Metadata = {
  title: t.common.epaper,
  description: `${site.name} का ई-पेपर — जल्द उपलब्ध।`,
  alternates: { canonical: "/epaper" },
};

export default function EpaperPage() {
  return (
    <SiteShell variant="full">
      <Container className="max-w-[720px] pb-12 pt-5">
        <SectionHeader title={t.common.epaper} as="h1" />
        <p className="mb-3 text-[15px] text-muted">{hindiLongDate(MOCK_NOW_ISO)}</p>
        <p className="text-[16px] leading-[1.7] text-ink-2">
          ई-पेपर अभी तैयार किया जा रहा है। संस्करण और शहर चुनकर पन्ने पढ़ने की
          सुविधा लॉन्च के बाद यहीं मिलेगी। तब तक ताज़ा ख़बरें होम पेज पर पढ़ें।
        </p>
      </Container>
    </SiteShell>
  );
}
