import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { getAllCategories, getAuthors, getStates } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { authorHref, categoryHref, stateHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** HTML sitemap — §6.12. */

export const metadata: Metadata = {
  title: t.legal.sitemap,
  description: `${site.name} के सभी सेक्शन, राज्य और पेज एक जगह।`,
  alternates: { canonical: "/sitemap" },
};

const PAGES = [
  { href: "/", label: t.common.home },
  { href: "/videos", label: t.common.video },
  { href: "/web-stories", label: t.common.webStories },
  { href: "/photos", label: t.home.photoGallery },
  { href: "/rashifal", label: t.home.rashifal },
  { href: "/epaper", label: t.common.epaper },
  { href: "/newsletter", label: t.newsletter.title },
  { href: "/search", label: t.common.search },
  { href: "/about", label: t.legal.about },
  { href: "/contact", label: t.legal.contact },
  { href: "/advertise", label: t.legal.advertise },
  { href: "/privacy", label: t.legal.privacy },
  { href: "/terms", label: t.legal.terms },
  { href: "/cookies", label: t.legal.cookies },
  { href: "/ethics", label: t.legal.ethics },
  { href: "/grievance", label: t.legal.grievance },
  { href: "/consent", label: t.legal.consent },
];

export default async function SitemapPage() {
  const [categories, states, authors] = await Promise.all([
    getAllCategories(),
    getStates(),
    getAuthors(),
  ]);

  return (
    <SiteShell variant="full">
      <Container className="pb-12 pt-5">
        <SectionHeader title={t.legal.sitemap} as="h1" />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <section>
            <h2 className="mb-2 text-[17px] font-extrabold">पेज</h2>
            <ul className="space-y-1">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-[15px] hover:text-brand">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-[17px] font-extrabold">{t.nav.categories}</h2>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={categoryHref(category.slug)}
                    className="text-[15px] hover:text-brand"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-[17px] font-extrabold">{t.nav.states}</h2>
            <ul className="space-y-1">
              {states.map((state) => (
                <li key={state.slug}>
                  <Link
                    href={stateHref(state.slug)}
                    className="text-[15px] hover:text-brand"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-[17px] font-extrabold">लेखक</h2>
            <ul className="space-y-1">
              {authors.map((author) => (
                <li key={author.slug}>
                  <Link
                    href={authorHref(author.slug)}
                    className="text-[15px] hover:text-brand"
                  >
                    {author.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] text-muted">
              XML साइटमैप: <Link href="/sitemap.xml" className="text-brand">/sitemap.xml</Link>
              {" · "}
              <Link href="/news-sitemap.xml" className="text-brand">
                /news-sitemap.xml
              </Link>
              {" · "}
              <Link href="/rss" className="text-brand">
                /rss
              </Link>
            </p>
          </section>
        </div>
      </Container>
    </SiteShell>
  );
}
