"use client";

import Link from "next/link";
import { useState } from "react";

import { useConsent } from "@/components/consent/consent-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OPTIONAL_PURPOSES, type ConsentState } from "@/lib/consent/types";
import { t } from "@/lib/i18n";

/**
 * Cookie banner — DPDP global rule §5, PRD §10.4.
 *
 * - "सभी अस्वीकार करें" has exactly the same prominence as "सभी स्वीकार करें".
 * - Closing the banner counts as reject (there is no dismiss-without-choice).
 * - Optional purposes are off by default in the Customize panel.
 * - It is a fixed overlay, so it never pushes content and cannot cause CLS.
 */

const PURPOSE_COPY = {
  necessary: { title: t.consent.necessary, body: t.consent.necessaryBody },
  analytics: { title: t.consent.analytics, body: t.consent.analyticsBody },
  ads: { title: t.consent.ads, body: t.consent.adsBody },
  personalisation: {
    title: t.consent.personalisation,
    body: t.consent.personalisationBody,
  },
} as const;

export function CookieBanner() {
  const {
    consent,
    decided,
    hydrated,
    panelOpen,
    openPanel,
    closePanel,
    save,
    acceptAllPurposes,
    rejectAllPurposes,
  } = useConsent();

  // Edits made in the panel, kept separate from the saved choice so closing
  // the dialog discards them. No effect needed: the saved consent is the
  // fallback until the reader touches a switch.
  const [edits, setEdits] = useState<Partial<ConsentState> | null>(null);
  const draft: ConsentState = {
    necessary: true,
    analytics: edits?.analytics ?? consent?.analytics ?? false,
    ads: edits?.ads ?? consent?.ads ?? false,
    personalisation: edits?.personalisation ?? consent?.personalisation ?? false,
  };

  // Rendered only after hydration, so a reader who already chose never sees
  // the banner flash.
  const showBanner = hydrated && !decided;

  return (
    <>
      {showBanner ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t.consent.bannerTitle}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.12)] lg:bottom-4 lg:left-4 lg:right-auto lg:max-w-[440px] lg:rounded-[8px] lg:border"
        >
          <div className="px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-4 lg:p-5">
            <h2 className="text-[17px] font-extrabold text-ink">
              {t.consent.bannerTitle}
            </h2>
            <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-2">
              {t.consent.bannerBody}{" "}
              <Link href="/cookies" className="font-semibold text-brand underline">
                {t.legal.cookies}
              </Link>
              {" · "}
              <Link href="/privacy" className="font-semibold text-brand underline">
                {t.legal.privacy}
              </Link>
            </p>
            <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="brand"
                size="lg"
                className="flex-1"
                onClick={() => acceptAllPurposes("cookie_banner")}
              >
                {t.consent.acceptAll}
              </Button>
              <Button
                variant="ink"
                size="lg"
                className="flex-1"
                onClick={() => rejectAllPurposes("cookie_banner")}
              >
                {t.consent.rejectAll}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={openPanel}
              >
                {t.consent.customize}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog
        open={panelOpen}
        onOpenChange={(open) => {
          if (open) {
            openPanel();
          } else {
            setEdits(null);
            closePanel();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.consent.managePreferences}</DialogTitle>
            <DialogDescription>{t.consent.bannerBody}</DialogDescription>
          </DialogHeader>

          <DialogBody>
            <ul className="space-y-4">
              <li className="rounded-[6px] border border-line bg-soft p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15.5px] font-bold text-ink">
                    {PURPOSE_COPY.necessary.title}
                  </h3>
                  <span className="shrink-0 rounded-[3px] bg-ink px-2 py-[2px] text-[12px] font-semibold text-white">
                    {t.consent.always}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-2">
                  {PURPOSE_COPY.necessary.body}
                </p>
              </li>

              {OPTIONAL_PURPOSES.map((purpose) => {
                const copy = PURPOSE_COPY[purpose];
                const checked = draft[purpose] === true;
                return (
                  <li
                    key={purpose}
                    className="rounded-[6px] border border-line p-3.5"
                  >
                    <label className="flex cursor-pointer items-start justify-between gap-3">
                      <span>
                        <span className="block text-[15.5px] font-bold text-ink">
                          {copy.title}
                        </span>
                        <span className="mt-1 block text-[13.5px] leading-[1.6] text-ink-2">
                          {copy.body}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          setEdits((current) => ({
                            ...current,
                            [purpose]: event.target.checked,
                          }))
                        }
                        className="mt-1 size-5 shrink-0 accent-[#C8102E]"
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
          </DialogBody>

          <DialogFooter>
            <Button
              variant="outline"
              size="lg"
              onClick={() => rejectAllPurposes("consent_settings")}
            >
              {t.consent.rejectAll}
            </Button>
            <Button
              variant="brand"
              size="lg"
              onClick={() => save(draft, "consent_settings")}
            >
              {t.consent.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
