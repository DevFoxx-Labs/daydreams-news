import type { Category } from "./types";

/**
 * Taxonomy — PRD §7.5. Two levels, ordered, with nav visibility.
 * Slugs are Latin transliterations of the Hindi names (SEO-1 / FR-C1).
 */
export const categories: Category[] = [
  {
    slug: "desh",
    name: "देश",
    inNav: true,
    children: [
      { slug: "rajniti", name: "राजनीति" },
      { slug: "raksha", name: "रक्षा" },
      { slug: "railway", name: "रेलवे" },
      { slug: "krishi", name: "कृषि" },
      { slug: "mausam", name: "मौसम" },
      { slug: "infra", name: "इंफ्रा" },
      { slug: "samaj", name: "समाज" },
      { slug: "swasthya", name: "स्वास्थ्य" },
    ],
  },
  {
    slug: "duniya",
    name: "दुनिया",
    inNav: true,
    children: [
      { slug: "asia", name: "एशिया" },
      { slug: "america", name: "अमेरिका" },
      { slug: "europe", name: "यूरोप" },
      { slug: "padosi", name: "पड़ोसी देश" },
    ],
  },
  {
    slug: "manoranjan",
    name: "मनोरंजन",
    inNav: true,
    children: [
      { slug: "bollywood", name: "बॉलीवुड" },
      { slug: "ott", name: "OTT" },
      { slug: "tv", name: "टीवी" },
      { slug: "music", name: "म्यूज़िक" },
    ],
  },
  {
    slug: "cricket",
    name: "क्रिकेट",
    inNav: true,
    children: [
      { slug: "team-india", name: "टीम इंडिया" },
      { slug: "ipl", name: "लीग" },
      { slug: "record", name: "रिकॉर्ड" },
    ],
  },
  {
    slug: "khel",
    name: "खेल",
    inNav: true,
    children: [
      { slug: "football", name: "फ़ुटबॉल" },
      { slug: "hockey", name: "हॉकी" },
      { slug: "kabaddi", name: "कबड्डी" },
      { slug: "olympic", name: "ओलंपिक" },
    ],
  },
  {
    slug: "business",
    name: "बिज़नेस",
    inNav: true,
    children: [
      { slug: "bazar", name: "शेयर बाज़ार" },
      { slug: "sona-chandi", name: "सोना-चांदी" },
      { slug: "arthvyavastha", name: "अर्थव्यवस्था" },
      { slug: "personal-finance", name: "पर्सनल फ़ाइनेंस" },
    ],
  },
  {
    slug: "tech",
    name: "टेक",
    inNav: true,
    children: [
      { slug: "mobile", name: "मोबाइल" },
      { slug: "ai", name: "AI" },
      { slug: "gadget", name: "गैजेट" },
      { slug: "vigyan", name: "विज्ञान" },
    ],
  },
  {
    slug: "lifestyle",
    name: "लाइफस्टाइल",
    inNav: true,
    children: [
      { slug: "sehat", name: "सेहत" },
      { slug: "khanpan", name: "खान-पान" },
      { slug: "safar", name: "सफ़र" },
      { slug: "rishte", name: "रिश्ते" },
    ],
  },
  {
    slug: "dharm",
    name: "धर्म",
    inNav: true,
    children: [
      { slug: "vrat-tyohar", name: "व्रत-त्योहार" },
      { slug: "mandir", name: "मंदिर" },
    ],
  },
  {
    slug: "shiksha",
    name: "शिक्षा",
    inNav: true,
    children: [
      { slug: "board", name: "बोर्ड परीक्षा" },
      { slug: "result", name: "रिज़ल्ट" },
      { slug: "admission", name: "एडमिशन" },
    ],
  },
  {
    slug: "naukri",
    name: "नौकरी",
    inNav: true,
    children: [
      { slug: "sarkari-naukri", name: "सरकारी नौकरी" },
      { slug: "bharti", name: "भर्ती" },
      { slug: "career", name: "करियर" },
    ],
  },
  {
    slug: "auto",
    name: "ऑटो",
    inNav: true,
    children: [
      { slug: "car", name: "कार" },
      { slug: "bike", name: "बाइक" },
      { slug: "ev", name: "ईवी" },
    ],
  },
  {
    slug: "jyotish",
    name: "ज्योतिष",
    inNav: true,
    children: [{ slug: "rashifal", name: "राशिफल" }],
  },
  // Below here: not in the top-level bar, reachable from "और ▾" and the footer.
  { slug: "videos", name: "वीडियो" },
  { slug: "photos", name: "फ़ोटो" },
  { slug: "web-stories", name: "वेब स्टोरीज़" },
  { slug: "rajya", name: "राज्य" },
];

/** Top-level items rendered in the red nav bar (DESIGN.md §4.3). */
export const navCategories = categories.filter((c) => c.inNav);

/** Flat lookup of every category and sub-category by slug. */
export const categoryBySlug: Record<string, Category> = (() => {
  const map: Record<string, Category> = {};
  for (const c of categories) {
    map[c.slug] = c;
    for (const child of c.children ?? []) map[child.slug] = child;
  }
  return map;
})();

/** The top-level parent a (sub-)category belongs to, for breadcrumbs. */
export const parentOf: Record<string, Category> = (() => {
  const map: Record<string, Category> = {};
  for (const c of categories) {
    for (const child of c.children ?? []) map[child.slug] = c;
  }
  return map;
})();

export function cat(slug: string): Category {
  const found = categoryBySlug[slug];
  if (!found) throw new Error(`Unknown category slug: ${slug}`);
  return found;
}
