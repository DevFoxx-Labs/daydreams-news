"use client";

import Script from "next/script";

import { useConsent } from "@/components/consent/consent-provider";
import { flags } from "@/lib/site";

/**
 * The only place third-party scripts may be loaded.
 *
 * Nothing is rendered until the matching purpose is granted, so before consent
 * there is no network request to any analytics or ad domain at all — not even
 * a "consent mode" ping (global rule §5). Each script also needs its feature
 * flag on, so a missing configuration fails closed.
 */
export function ConsentScripts() {
  const { consent } = useConsent();

  const analyticsOn = flags.analytics && consent?.analytics === true;
  const adsOn = flags.adNetwork && consent?.ads === true;

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  const adClient = process.env.NEXT_PUBLIC_AD_CLIENT;

  return (
    <>
      {analyticsOn && analyticsId ? (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
          strategy="lazyOnload"
        />
      ) : null}

      {adsOn && adClient ? (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      ) : null}
    </>
  );
}
