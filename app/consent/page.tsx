import type { Metadata } from "next";
import Link from "next/link";

import { ConsentSettings } from "@/components/consent/consent-settings";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { t } from "@/lib/i18n";
import { NOTICE_VERSION_STRING } from "@/lib/legal/notices";

/** "आपकी सहमतियां" — consent dashboard (global rule §3 and §4). */

export const metadata: Metadata = {
  title: t.legal.consent,
  description:
    "अपनी कुकी और डेटा सहमतियां देखें, बदलें या वापस लें, और अपना सहमति इतिहास पढ़ें।",
  alternates: { canonical: "/consent" },
  robots: { index: false, follow: true },
};

export default function ConsentPage() {
  return (
    <SiteShell variant="full">
      <Container className="max-w-[820px] pb-12 pt-5">
        <SectionHeader title={t.legal.consent} as="h1" />
        <p className="mb-6 text-[15px] leading-[1.7] text-ink-2">
          यहां आप अपनी हर वैकल्पिक सहमति चालू या बंद कर सकते हैं। बंद करते ही
          संबंधित स्क्रिप्ट लोड होना तुरंत रुक जाता है।{" "}
          <Link href="/cookies" className="font-semibold text-brand underline">
            {t.legal.cookies}
          </Link>{" "}
          और{" "}
          <Link href="/privacy" className="font-semibold text-brand underline">
            {t.legal.privacy}
          </Link>{" "}
          भी पढ़ें।
        </p>
        <p className="mb-8 font-ui text-[12.5px] text-muted">
          {t.consent.noticeVersion}: {NOTICE_VERSION_STRING}
        </p>

        <ConsentSettings />
      </Container>
    </SiteShell>
  );
}
