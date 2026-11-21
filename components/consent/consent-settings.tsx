"use client";

import Link from "next/link";

import { useConsent } from "@/components/consent/consent-provider";
import { Button } from "@/components/ui/button";
import { OPTIONAL_PURPOSES } from "@/lib/consent/types";
import { hindiDateTime } from "@/lib/format/hindiDate";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * "आपकी सहमतियां" — the reader sees and changes every optional consent, and
 * reads their own timestamped history (global rule §3 and §4).
 * Withdrawing is exactly as easy as granting: one switch.
 */

const COPY = {
  analytics: { title: t.consent.analytics, body: t.consent.analyticsBody },
  ads: { title: t.consent.ads, body: t.consent.adsBody },
  personalisation: {
    title: t.consent.personalisation,
    body: t.consent.personalisationBody,
  },
} as const;

const STATUS_LABEL = {
  granted: t.consent.granted,
  denied: t.consent.denied,
  withdrawn: t.consent.withdrawn,
} as const;

export function ConsentSettings() {
  const { consent, history, save, rejectAllPurposes } = useConsent();

  function toggle(purpose: (typeof OPTIONAL_PURPOSES)[number], value: boolean) {
    void save(
      {
        necessary: true,
        analytics: purpose === "analytics" ? value : consent?.analytics === true,
        ads: purpose === "ads" ? value : consent?.ads === true,
        personalisation:
          purpose === "personalisation"
            ? value
            : consent?.personalisation === true,
      },
      "preferences",
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="your-consents">
        <h2 id="your-consents" className="mb-3 text-[20px] font-extrabold">
          {t.legal.consent}
        </h2>

        <ul className="space-y-3">
          <li className="rounded-[6px] border border-line bg-soft p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[16px] font-bold">{t.consent.necessary}</h3>
              <span className="shrink-0 rounded-[3px] bg-ink px-2 py-[2px] text-[12px] font-semibold text-white">
                {t.consent.always}
              </span>
            </div>
            <p className="mt-1 text-[14px] leading-[1.6] text-ink-2">
              {t.consent.necessaryBody}
            </p>
          </li>

          {OPTIONAL_PURPOSES.map((purpose) => {
            const checked = consent?.[purpose] === true;
            return (
              <li key={purpose} className="rounded-[6px] border border-line p-4">
                <label className="flex cursor-pointer items-start justify-between gap-3">
                  <span>
                    <span className="block text-[16px] font-bold">
                      {COPY[purpose].title}
                    </span>
                    <span className="mt-1 block text-[14px] leading-[1.6] text-ink-2">
                      {COPY[purpose].body}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "text-[13px] font-semibold",
                        checked ? "text-up" : "text-meta",
                      )}
                    >
                      {checked ? t.consent.granted : t.consent.denied}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => toggle(purpose, event.target.checked)}
                      className="size-5 accent-[#C8102E]"
                    />
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <Button
          variant="outline"
          size="lg"
          className="mt-4"
          onClick={() => rejectAllPurposes("preferences")}
        >
          {t.consent.withdrawAll}
        </Button>
      </section>

      <section aria-labelledby="consent-history">
        <h2 id="consent-history" className="mb-3 text-[20px] font-extrabold">
          {t.consent.history}
        </h2>
        {history.length === 0 ? (
          <p className="text-[15px] text-meta">{t.consent.historyEmpty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr>
                  {[
                    t.search.category,
                    t.consent.granted,
                    t.consent.source,
                    t.consent.noticeVersion,
                    t.consent.savedAt,
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="border border-line bg-soft px-2.5 py-2 text-start font-bold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 50).map((entry, index) => (
                  <tr key={`${entry.createdAt}-${entry.purpose}-${index}`}>
                    <td className="border border-line px-2.5 py-2">
                      {COPY[entry.purpose as keyof typeof COPY]?.title ??
                        entry.purpose}
                    </td>
                    <td className="border border-line px-2.5 py-2">
                      {STATUS_LABEL[entry.status]}
                    </td>
                    <td className="border border-line px-2.5 py-2">
                      {entry.method}
                    </td>
                    <td className="border border-line px-2.5 py-2 font-ui text-[12.5px]">
                      {entry.noticeVersion}
                    </td>
                    <td className="border border-line px-2.5 py-2">
                      {hindiDateTime(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-[13px] text-meta">
          यह इतिहास इसी डिवाइस का है। हमारे सर्वर पर भी हर सहमति का रिकॉर्ड
          सुरक्षित रखा जाता है।
        </p>
      </section>

      <section aria-labelledby="your-rights">
        <h2 id="your-rights" className="mb-2 text-[20px] font-extrabold">
          {t.consent.rightsTitle}
        </h2>
        <p className="text-[15px] leading-[1.7]">
          आप अपनी जानकारी देख सकते हैं, सुधार करा सकते हैं, मिटवा सकते हैं,
          नामांकन कर सकते हैं और सहमति वापस ले सकते हैं।{" "}
          <Link href="/grievance" className="font-semibold text-brand underline">
            {t.consent.makeRequest}
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
