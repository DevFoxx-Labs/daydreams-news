import type { IndianState } from "./types";

/**
 * States / UTs with their major cities — PRD §7.5 (pre-seeded taxonomy).
 * `featured` states appear in the home strip and the mobile menu grid,
 * in the order shown in the reference screens.
 */
export const states: IndianState[] = [
  {
    slug: "uttar-pradesh",
    name: "उत्तर प्रदेश",
    featured: true,
    cities: [
      { slug: "lucknow", name: "लखनऊ" },
      { slug: "kanpur", name: "कानपुर" },
      { slug: "varanasi", name: "वाराणसी" },
      { slug: "prayagraj", name: "प्रयागराज" },
      { slug: "agra", name: "आगरा" },
      { slug: "noida", name: "नोएडा" },
    ],
  },
  {
    slug: "bihar",
    name: "बिहार",
    featured: true,
    cities: [
      { slug: "patna", name: "पटना" },
      { slug: "gaya", name: "गया" },
      { slug: "muzaffarpur", name: "मुज़फ़्फ़रपुर" },
      { slug: "bhagalpur", name: "भागलपुर" },
    ],
  },
  {
    slug: "delhi",
    name: "दिल्ली",
    featured: true,
    cities: [
      { slug: "nayi-dilli", name: "नई दिल्ली" },
      { slug: "dwarka", name: "द्वारका" },
      { slug: "rohini", name: "रोहिणी" },
    ],
  },
  {
    slug: "madhya-pradesh",
    name: "मध्य प्रदेश",
    featured: true,
    cities: [
      { slug: "bhopal", name: "भोपाल" },
      { slug: "indore", name: "इंदौर" },
      { slug: "gwalior", name: "ग्वालियर" },
      { slug: "jabalpur", name: "जबलपुर" },
    ],
  },
  {
    slug: "rajasthan",
    name: "राजस्थान",
    featured: true,
    cities: [
      { slug: "jaipur", name: "जयपुर" },
      { slug: "jodhpur", name: "जोधपुर" },
      { slug: "udaipur", name: "उदयपुर" },
      { slug: "kota", name: "कोटा" },
    ],
  },
  {
    slug: "haryana",
    name: "हरियाणा",
    featured: true,
    cities: [
      { slug: "gurugram", name: "गुरुग्राम" },
      { slug: "faridabad", name: "फ़रीदाबाद" },
      { slug: "hisar", name: "हिसार" },
    ],
  },
  {
    slug: "punjab",
    name: "पंजाब",
    featured: true,
    cities: [
      { slug: "ludhiana", name: "लुधियाना" },
      { slug: "amritsar", name: "अमृतसर" },
      { slug: "jalandhar", name: "जालंधर" },
    ],
  },
  {
    slug: "uttarakhand",
    name: "उत्तराखंड",
    featured: true,
    cities: [
      { slug: "dehradun", name: "देहरादून" },
      { slug: "haridwar", name: "हरिद्वार" },
      { slug: "nainital", name: "नैनीताल" },
    ],
  },
  {
    slug: "jharkhand",
    name: "झारखंड",
    featured: true,
    cities: [
      { slug: "ranchi", name: "रांची" },
      { slug: "jamshedpur", name: "जमशेदपुर" },
      { slug: "dhanbad", name: "धनबाद" },
    ],
  },
  {
    slug: "himachal-pradesh",
    name: "हिमाचल",
    featured: true,
    cities: [
      { slug: "shimla", name: "शिमला" },
      { slug: "manali", name: "मनाली" },
      { slug: "dharamshala", name: "धर्मशाला" },
    ],
  },
  {
    slug: "jammu-kashmir",
    name: "जम्मू-कश्मीर",
    featured: true,
    cities: [
      { slug: "srinagar", name: "श्रीनगर" },
      { slug: "jammu", name: "जम्मू" },
    ],
  },
  {
    slug: "chhattisgarh",
    name: "छत्तीसगढ़",
    featured: true,
    cities: [
      { slug: "raipur", name: "रायपुर" },
      { slug: "bilaspur", name: "बिलासपुर" },
    ],
  },
  {
    slug: "maharashtra",
    name: "महाराष्ट्र",
    cities: [
      { slug: "mumbai", name: "मुंबई" },
      { slug: "pune", name: "पुणे" },
      { slug: "nagpur", name: "नागपुर" },
    ],
  },
  {
    slug: "gujarat",
    name: "गुजरात",
    cities: [
      { slug: "ahmedabad", name: "अहमदाबाद" },
      { slug: "surat", name: "सूरत" },
      { slug: "vadodara", name: "वडोदरा" },
    ],
  },
  {
    slug: "west-bengal",
    name: "पश्चिम बंगाल",
    cities: [
      { slug: "kolkata", name: "कोलकाता" },
      { slug: "siliguri", name: "सिलीगुड़ी" },
    ],
  },
  {
    slug: "odisha",
    name: "ओडिशा",
    cities: [
      { slug: "bhubaneswar", name: "भुवनेश्वर" },
      { slug: "cuttack", name: "कटक" },
    ],
  },
  {
    slug: "assam",
    name: "असम",
    cities: [{ slug: "guwahati", name: "गुवाहाटी" }],
  },
  {
    slug: "telangana",
    name: "तेलंगाना",
    cities: [{ slug: "hyderabad", name: "हैदराबाद" }],
  },
  {
    slug: "karnataka",
    name: "कर्नाटक",
    cities: [
      { slug: "bengaluru", name: "बेंगलुरु" },
      { slug: "mysuru", name: "मैसूरु" },
    ],
  },
  {
    slug: "tamil-nadu",
    name: "तमिलनाडु",
    cities: [{ slug: "chennai", name: "चेन्नई" }],
  },
  {
    slug: "kerala",
    name: "केरल",
    cities: [{ slug: "kochi", name: "कोच्चि" }],
  },
  {
    slug: "andhra-pradesh",
    name: "आंध्र प्रदेश",
    cities: [{ slug: "vijayawada", name: "विजयवाड़ा" }],
  },
  {
    slug: "goa",
    name: "गोवा",
    cities: [{ slug: "panaji", name: "पणजी" }],
  },
];

export const featuredStates = states.filter((s) => s.featured);

export const stateBySlug: Record<string, IndianState> = Object.fromEntries(
  states.map((s) => [s.slug, s]),
);

export function cityName(stateSlug: string, citySlug: string): string | undefined {
  return stateBySlug[stateSlug]?.cities.find((c) => c.slug === citySlug)?.name;
}

/** Cities offered in the weather / AQI selector (FR-G4). */
export const weatherCities = [
  { slug: "nayi-dilli", name: "नई दिल्ली" },
  { slug: "lucknow", name: "लखनऊ" },
  { slug: "patna", name: "पटना" },
  { slug: "jaipur", name: "जयपुर" },
  { slug: "bhopal", name: "भोपाल" },
  { slug: "mumbai", name: "मुंबई" },
  { slug: "kolkata", name: "कोलकाता" },
  { slug: "bengaluru", name: "बेंगलुरु" },
  { slug: "dehradun", name: "देहरादून" },
  { slug: "ranchi", name: "रांची" },
];
