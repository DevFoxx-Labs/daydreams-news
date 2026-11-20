import type { Metadata } from "next";

import { NewsletterBox } from "@/components/article/newsletter-box";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Newsletter signup page — FR-E1 (double opt-in, consent recorded). */

export const metadata: Metadata = {
  title: t.newsletter.title,
  description: `${t.newsletter.subtitle} — ${site.name}`,
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <SiteShell variant="full">
      <Container className="max-w-[720px] pb-12 pt-5">
        <SectionHeader title={t.newsletter.title} as="h1" />
        <p className="mb-6 text-[16px] leading-[1.7] text-ink-2">
          हर सुबह 7 बजे दिन की 10 सबसे ज़रूरी ख़बरें, एक ईमेल में। जुड़ने के बाद
          आपके पते पर पुष्टि का लिंक भेजा जाएगा — उस पर क्लिक करने के बाद ही
          न्यूज़लेटर शुरू होगा।
        </p>
        <NewsletterBox />
        <ul className="mt-6 list-disc space-y-1.5 ps-5 text-[14.5px] leading-[1.6] text-ink-2">
          <li>आपका ईमेल पता सिर्फ़ इसी न्यूज़लेटर के लिए इस्तेमाल होगा।</li>
          <li>हर ईमेल में सदस्यता छोड़ने का लिंक रहेगा।</li>
          <li>सदस्यता छोड़ने पर आपका पता 30 दिन में हटा दिया जाता है।</li>
        </ul>
      </Container>
    </SiteShell>
  );
}
