import { minutesAgo, minutesAhead } from "./clock";
import type { HomeCuration, RashiSign, TickerItem, TrendingTag } from "./types";

/**
 * Editor-curated surfaces. In the CMS these are the Ticker manager, Trending
 * tags manager and the Home curation board (PRD §7.4).
 */

/** FR-G2 — up to 6 items, newest first, auto-expiring (default 6h). */
export const tickerItems: TickerItem[] = [
  {
    id: "t1",
    text: "मौसम विभाग ने 5 राज्यों में घने कोहरे का अलर्ट जारी किया",
    href: "/desh/uttar-bharat-kohra-thand-double-attack-1001",
    publishedAt: minutesAgo(10),
    expiresAt: minutesAhead(350),
  },
  {
    id: "t2",
    text: "दिल्ली मेट्रो की नई लाइन पर ट्रायल रन शुरू",
    href: "/desh/dilli-metro-nayi-line-par-trial-run-1220",
    publishedAt: minutesAgo(50),
    expiresAt: minutesAhead(310),
  },
  {
    id: "t3",
    text: "बोर्ड परीक्षा की डेटशीट अगले हफ़्ते जारी होगी",
    href: "/shiksha/board-pariksha-nayi-guideline-jari-1011",
    publishedAt: minutesAgo(70),
    expiresAt: minutesAhead(290),
  },
  {
    id: "t4",
    text: "सोने के दाम में लगातार तीसरे दिन गिरावट",
    href: "/business/sona-2-hazar-rupaye-sasta-1084",
    publishedAt: minutesAgo(110),
    expiresAt: minutesAhead(250),
  },
  {
    id: "t5",
    text: "रेलवे ने त्योहारों के लिए 200 स्पेशल ट्रेनें चलाने का ऐलान किया",
    href: "/desh/railway-200-special-train-tyohar-1010",
    publishedAt: minutesAgo(35),
    expiresAt: minutesAhead(325),
  },
  {
    id: "t6",
    text: "यूपी के 18 ज़िलों में स्कूल 10 बजे से खुलेंगे",
    href: "/shiksha/up-18-zilon-mein-school-ka-samay-badla-1200",
    publishedAt: minutesAgo(29),
    expiresAt: minutesAhead(331),
  },
  {
    /** Already expired — proves the expiry filter works (FR-G2). */
    id: "t0",
    text: "यह पुराना ब्रेकिंग आइटम दिखना नहीं चाहिए",
    href: "/",
    publishedAt: minutesAgo(600),
    expiresAt: minutesAgo(240),
  },
];

/** FR-G3 — ordered list, up to 10. */
export const trendingTags: TrendingTag[] = [
  { label: "मौसम अपडेट", slug: "mausam" },
  { label: "दिल्ली प्रदूषण", slug: "dilli-pradushan" },
  { label: "क्रिकेट", slug: "cricket" },
  { label: "शेयर बाज़ार", slug: "share-bazar" },
  { label: "सरकारी नौकरी", slug: "sarkari-naukri" },
  { label: "बोर्ड परीक्षा 2027", slug: "board-pariksha-2027" },
  { label: "सोना-चांदी", slug: "sona-chandi" },
  { label: "राशिफल", slug: "rashifal" },
];

/** FR-H1 — pinned slots. Empty slots auto-fill with the latest stories. */
export const homeCuration: HomeCuration = {
  heroId: "1001",
  secondaryIds: ["1002", "1003"],
  topNewsIds: ["1010", "1011", "1012", "1013", "1014"],
  featuredLiveBlogId: "2001",
  categoryLeadIds: {
    desh: "1020",
    duniya: "1050",
    cricket: "1060",
    manoranjan: "1070",
  },
};

/** FR-U2 — 12 signs. Text is demo copy from the CMS in production. */
export const rashiSigns: RashiSign[] = [
  {
    slug: "mesh",
    name: "मेष",
    glyph: "♈",
    dates: "21 मार्च – 19 अप्रैल",
    today:
      "दिन कामकाज के लिहाज़ से ठीक है। जल्दबाज़ी में कोई फ़ैसला न लें। (डेमो राशिफल)",
  },
  {
    slug: "vrishabh",
    name: "वृषभ",
    glyph: "♉",
    dates: "20 अप्रैल – 20 मई",
    today: "परिवार के साथ समय बिताने का मौका मिलेगा। ख़र्च पर नज़र रखें। (डेमो राशिफल)",
  },
  {
    slug: "mithun",
    name: "मिथुन",
    glyph: "♊",
    dates: "21 मई – 20 जून",
    today: "नई जानकारी काम आएगी। यात्रा की योजना टल सकती है। (डेमो राशिफल)",
  },
  {
    slug: "kark",
    name: "कर्क",
    glyph: "♋",
    dates: "21 जून – 22 जुलाई",
    today: "सेहत का ध्यान रखें। पुराना काम पूरा होने के आसार हैं। (डेमो राशिफल)",
  },
  {
    slug: "singh",
    name: "सिंह",
    glyph: "♌",
    dates: "23 जुलाई – 22 अगस्त",
    today: "कार्यस्थल पर आपकी बात सुनी जाएगी। संयम रखें। (डेमो राशिफल)",
  },
  {
    slug: "kanya",
    name: "कन्या",
    glyph: "♍",
    dates: "23 अगस्त – 22 सितंबर",
    today: "योजना बनाकर काम करें, नतीजे बेहतर मिलेंगे। (डेमो राशिफल)",
  },
  {
    slug: "tula",
    name: "तुला",
    glyph: "♎",
    dates: "23 सितंबर – 22 अक्टूबर",
    today: "बातचीत से उलझा मामला सुलझ सकता है। (डेमो राशिफल)",
  },
  {
    slug: "vrishchik",
    name: "वृश्चिक",
    glyph: "♏",
    dates: "23 अक्टूबर – 21 नवंबर",
    today: "दिन शुभ है। लंबे समय से रुका काम आगे बढ़ेगा। (डेमो राशिफल)",
  },
  {
    slug: "dhanu",
    name: "धनु",
    glyph: "♐",
    dates: "22 नवंबर – 21 दिसंबर",
    today: "पढ़ाई और प्रतियोगी परीक्षा की तैयारी में मन लगेगा। (डेमो राशिफल)",
  },
  {
    slug: "makar",
    name: "मकर",
    glyph: "♑",
    dates: "22 दिसंबर – 19 जनवरी",
    today: "आर्थिक मामलों में सावधानी बरतें। (डेमो राशिफल)",
  },
  {
    slug: "kumbh",
    name: "कुंभ",
    glyph: "♒",
    dates: "20 जनवरी – 18 फ़रवरी",
    today: "दोस्तों से मदद मिल सकती है। दिन सामान्य रहेगा। (डेमो राशिफल)",
  },
  {
    slug: "meen",
    name: "मीन",
    glyph: "♓",
    dates: "19 फ़रवरी – 20 मार्च",
    today: "घर के कामों में व्यस्तता रहेगी। सेहत ठीक रहेगी। (डेमो राशिफल)",
  },
];
