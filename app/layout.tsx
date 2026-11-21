import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter, Mukta } from "next/font/google";

import { CookieBanner } from "@/components/consent/cookie-banner";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { ConsentScripts } from "@/components/consent/consent-scripts";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";

import "./globals.css";

/**
 * Root layout — fonts, consent and the document shell only.
 *
 * The visible chrome (utility bar, masthead, nav, ticker, footer, tab bar)
 * lives in `<SiteShell>`, which each page composes with the variant its
 * template needs: `full` for list pages, `reading` for the compact article and
 * live-blog header (DESIGN.md §6), `bare` for the web-story player.
 */

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-mukta",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ताज़ा हिंदी समाचार, देश-दुनिया और आपके शहर की ख़बरें`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss" } },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.colors.brand,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${mukta.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col bg-white">
        <ConsentProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[4px] focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
          >
            {t.common.skipToContent}
          </a>
          {children}
          {/*
            The banner reads the pathname (it stays out of the staff panel),
            which is request-time data on routes whose path isn't known at
            build time. A null fallback costs nothing: it only ever appears
            after hydration anyway.
          */}
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
          <ConsentScripts />
        </ConsentProvider>
      </body>
    </html>
  );
}
