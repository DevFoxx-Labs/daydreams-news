import type { Author } from "./types";

/**
 * Demo newsroom. Names are deliberately generic job-title style names so no
 * real journalist is impersonated (DESIGN.md §9).
 */
export const authors: Author[] = [
  {
    slug: "desk-report",
    name: "ख़बर सेतु डेस्क",
    role: "न्यूज़ डेस्क",
    bio: "ख़बर सेतु का न्यूज़ डेस्क ताज़ा घटनाक्रम पर नज़र रखता है और ख़बरों की पुष्टि के बाद उन्हें प्रकाशित करता है। (डेमो प्रोफ़ाइल)",
  },
  {
    slug: "reporter-ek",
    name: "रिपोर्टर का नाम",
    role: "विशेष संवाददाता",
    bio: "राष्ट्रीय ख़बरें, मौसम और आपदा प्रबंधन पर रिपोर्टिंग। (डेमो प्रोफ़ाइल)",
  },
  {
    slug: "senior-sampadak",
    name: "वरिष्ठ संपादक",
    role: "वरिष्ठ संपादक",
    bio: "नीति, राजनीति और संसद से जुड़ी ख़बरों का विश्लेषण। (डेमो प्रोफ़ाइल)",
  },
  {
    slug: "business-desk",
    name: "बिज़नेस डेस्क",
    role: "बिज़नेस डेस्क",
    bio: "शेयर बाज़ार, अर्थव्यवस्था और पर्सनल फ़ाइनेंस की ख़बरें। (डेमो प्रोफ़ाइल)",
  },
  {
    slug: "khel-desk",
    name: "खेल डेस्क",
    role: "खेल डेस्क",
    bio: "क्रिकेट और दूसरे खेलों की ताज़ा ख़बरें और आंकड़े। (डेमो प्रोफ़ाइल)",
  },
  {
    slug: "manoranjan-desk",
    name: "मनोरंजन डेस्क",
    role: "मनोरंजन डेस्क",
    bio: "सिनेमा, OTT और टीवी की ख़बरें। (डेमो प्रोफ़ाइल)",
  },
  {
    slug: "tech-desk",
    name: "टेक डेस्क",
    role: "टेक डेस्क",
    bio: "गैजेट, ऐप और विज्ञान से जुड़ी ख़बरें आसान भाषा में। (डेमो प्रोफ़ाइल)",
  },
  {
    slug: "career-desk",
    name: "करियर डेस्क",
    role: "करियर डेस्क",
    bio: "सरकारी नौकरी, भर्ती और परीक्षा परिणाम की जानकारी। (डेमो प्रोफ़ाइल)",
  },
];

export const authorBySlug: Record<string, Author> = Object.fromEntries(
  authors.map((a) => [a.slug, a]),
);
