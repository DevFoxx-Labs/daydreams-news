/**
 * Consent model — DPDP Act 2023 s.6 + DPDP Rules 2025.
 *
 * Purposes are **unbundled**: `necessary` is the only one that cannot be
 * switched off, and every optional purpose is OFF until the reader turns it on.
 */

export const CONSENT_PURPOSES = [
  "necessary",
  "analytics",
  "ads",
  "personalisation",
  /** Newsletter is its own purpose, not a cookie category. */
  "newsletter",
] as const;

export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];

/** The cookie categories the banner and the preferences panel switch. */
export const OPTIONAL_PURPOSES = [
  "analytics",
  "ads",
  "personalisation",
] as const satisfies readonly ConsentPurpose[];

export type ConsentStatus = "granted" | "denied" | "withdrawn";

/** The reader's current choice per purpose. */
export type ConsentState = {
  necessary: true;
  analytics: boolean;
  ads: boolean;
  personalisation: boolean;
};

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  ads: false,
  personalisation: false,
};

export type ConsentMethod =
  | "cookie_banner"
  | "consent_settings"
  | "signup_notice"
  | "checkbox"
  | "preferences";

export type ConsentSource = "web" | "android" | "ios";

/** One append-only ledger row (global rule §3). */
export type ConsentRecord = {
  id: string;
  userId: string | null;
  /** Anonymous device id for cookie choices made without an account. */
  visitorId: string;
  purpose: ConsentPurpose;
  status: ConsentStatus;
  method: ConsentMethod;
  source: ConsentSource;
  /** e.g. "privacy@2026-11-20;terms@2026-11-20;cookies@2026-11-20" */
  noticeVersion: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

/** What the browser keeps so the reader can see their own history. */
export type LocalConsentEntry = {
  purpose: ConsentPurpose;
  status: ConsentStatus;
  method: ConsentMethod;
  noticeVersion: string;
  createdAt: string;
};
