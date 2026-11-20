/**
 * Single source of truth for brand, contact and legal identity.
 * DESIGN.md §0: "keep the brand name in one config file so it can be renamed in one place".
 *
 * Anything that is a real-world legal fact (company name, address, grievance
 * officer) is read from the environment and falls back to a clearly marked
 * placeholder. Never hard-code invented legal details here.
 */

const env = (key: string, fallback: string) => process.env[key]?.trim() || fallback;

/** Marker that makes unfilled legal placeholders obvious in the UI and in review. */
export const PLACEHOLDER = "[भरना बाकी]";

export const site = {
  /** Brand name — placeholder until the final name is decided (PRD §15.1). */
  name: "ख़बर सेतु",
  nameLatin: "Khabar Setu",
  tagline: "सच की ख़बर, सबसे पहले",
  /** Devanagari letter used in the square logo mark. */
  mark: "ख़",
  locale: "hi-IN",
  lang: "hi",
  description:
    "देश-दुनिया, आपके राज्य और शहर की हर ज़रूरी ख़बर — भरोसे के साथ, आपकी भाषा में। ताज़ा समाचार, लाइव अपडेट, क्रिकेट, बिज़नेस, मनोरंजन और नौकरी की ख़बरें।",
  url: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  timezone: "Asia/Kolkata",
  defaultCity: "नई दिल्ली",
  defaultStateSlug: "uttar-pradesh",

  /** Legal entity — PRD §10.4, DPDP Act s.5 notice requirements. */
  legal: {
    entityName: env("NEXT_PUBLIC_LEGAL_ENTITY", PLACEHOLDER + " (कंपनी का नाम)"),
    address: env("NEXT_PUBLIC_LEGAL_ADDRESS", PLACEHOLDER + " (पंजीकृत पता)"),
    cin: env("NEXT_PUBLIC_LEGAL_CIN", PLACEHOLDER),
    /** Data Fiduciary contact — DPDP Rules 2025. */
    privacyEmail: env("NEXT_PUBLIC_PRIVACY_EMAIL", PLACEHOLDER + " (privacy@…)"),
    /** Grievance Officer — DPDP s.13 + IT Rules 2021. */
    grievanceOfficer: {
      name: env("NEXT_PUBLIC_GRIEVANCE_NAME", PLACEHOLDER + " (नाम)"),
      designation: "शिकायत निवारण अधिकारी (Grievance Officer)",
      email: env("NEXT_PUBLIC_GRIEVANCE_EMAIL", PLACEHOLDER + " (grievance@…)"),
      phone: env("NEXT_PUBLIC_GRIEVANCE_PHONE", PLACEHOLDER + " (+91…)"),
      acknowledgeHours: 48,
      resolveDays: 30,
    },
    /** Editorial contact — E-E-A-T + IT Rules 2021. */
    editorEmail: env("NEXT_PUBLIC_EDITOR_EMAIL", PLACEHOLDER + " (editor@…)"),
    adsEmail: env("NEXT_PUBLIC_ADS_EMAIL", PLACEHOLDER + " (ads@…)"),
  },

  social: {
    facebook: env("NEXT_PUBLIC_SOCIAL_FACEBOOK", "#"),
    x: env("NEXT_PUBLIC_SOCIAL_X", "#"),
    linkedin: env("NEXT_PUBLIC_SOCIAL_LINKEDIN", "#"),
    youtube: env("NEXT_PUBLIC_SOCIAL_YOUTUBE", "#"),
    instagram: env("NEXT_PUBLIC_SOCIAL_INSTAGRAM", "#"),
    whatsappChannel: env("NEXT_PUBLIC_SOCIAL_WHATSAPP", "#"),
    googleNews: env("NEXT_PUBLIC_SOCIAL_GOOGLE_NEWS", "#"),
  },

  apps: {
    /** Hidden until the real store listings exist. */
    googlePlay: process.env.NEXT_PUBLIC_APP_PLAY_URL || "",
    appStore: process.env.NEXT_PUBLIC_APP_IOS_URL || "",
  },

  /** English edition — hidden until it exists (FR-G5). */
  englishEditionUrl: process.env.NEXT_PUBLIC_EN_URL || "",

  colors: {
    brand: "#C8102E",
    brandDark: "#9E0B22",
    ink: "#111111",
    navy: "#0F1B33",
    gold: "#F6B40E",
  },
} as const;

/**
 * Feature flags. Fail closed: a feature is on only when the flag is
 * explicitly "true" (global engineering rule — never `?? true`).
 */
export const flags = {
  /** FR-A10 — next-story infinite scroll on mobile. */
  nextStoryInfiniteScroll: process.env.NEXT_PUBLIC_FLAG_NEXT_STORY === "true",
  /** AD-3 — real ad network. Off ⇒ AdSlot renders a reserved house placeholder. */
  adNetwork: process.env.NEXT_PUBLIC_FLAG_AD_NETWORK === "true",
  /** FR-E2 — web push opt-in. */
  webPush: process.env.NEXT_PUBLIC_FLAG_WEB_PUSH === "true",
  /** Analytics scripts (only ever loaded after consent as well). */
  analytics: process.env.NEXT_PUBLIC_FLAG_ANALYTICS === "true",
} as const;

export type Site = typeof site;
