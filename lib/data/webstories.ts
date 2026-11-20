import { cat } from "./categories";
import { minutesAgo } from "./clock";
import type { Media, SceneKey, WebStory } from "./types";

/** Web stories row — DESIGN.md §5.4 (seven cards, in this order). */

function slideImage(scene: SceneKey, alt: string): Media {
  return { scene, alt, width: 1080, height: 1920, isFile: true };
}

export const webStories: WebStory[] = [
  {
    slug: "december-mein-7-hill-station",
    title: "दिसंबर में घूमने के लिए 7 बेहतरीन हिल स्टेशन",
    category: cat("safar"),
    publishedAt: minutesAgo(310),
    cover: slideImage("hills", "बर्फ़ से ढकी पहाड़ी चोटियां"),
    articleId: "1101",
    slides: [
      {
        image: slideImage("hills", "बर्फ़ से ढकी चोटियां"),
        title: "सर्दियों में पहाड़ों का सबसे सुंदर रूप",
        text: "दिसंबर में बर्फ़बारी देखने के लिए ये जगहें सबसे अच्छी मानी जाती हैं।",
      },
      {
        image: slideImage("hills", "देवदार के जंगल"),
        title: "बर्फ़ से ढकी चोटियां और देवदार के जंगल",
        text: "दिसंबर में यहां का तापमान माइनस तक जाता है, बर्फ़बारी देखने का सबसे अच्छा समय।",
      },
      {
        image: slideImage("temple", "पहाड़ी कस्बे का मंदिर"),
        title: "पुराने कस्बे और शांत मंदिर",
        text: "भीड़ से दूर, धीमी रफ़्तार वाली जगहें।",
      },
      {
        image: slideImage("road", "पहाड़ी रास्ता"),
        title: "रास्ते में रुककर देखें घाटी का नज़ारा",
        text: "सफ़र से पहले मौसम और सड़क की स्थिति ज़रूर जांच लें।",
      },
      {
        image: slideImage("city", "कस्बे की शाम"),
        title: "शाम के बाज़ार और गर्म खाना",
        text: "स्थानीय खाने का स्वाद लेना न भूलें।",
      },
      {
        image: slideImage("hills", "सुबह की धूप"),
        title: "सुबह जल्दी निकलें",
        text: "दिन में धूप रहती है, शाम होते ही ठंड बढ़ जाती है।",
      },
      {
        image: slideImage("hills", "घाटी का नज़ारा"),
        title: "पूरी लिस्ट पढ़ें",
        text: "सातों जगहों की जानकारी, ख़र्च और सही समय — पूरी ख़बर में।",
      },
    ],
  },
  {
    slug: "desh-ke-5-prachin-mandir",
    title: "देश के 5 प्राचीन मंदिर, जिनका इतिहास है अनोखा",
    category: cat("mandir"),
    publishedAt: minutesAgo(340),
    cover: slideImage("temple", "प्राचीन मंदिर का शिखर"),
    articleId: "1104",
    slides: [
      {
        image: slideImage("temple", "मंदिर का शिखर"),
        title: "सदियों पुरानी वास्तुकला",
        text: "पत्थरों पर बनी नक्काशी आज भी हैरान करती है।",
      },
      {
        image: slideImage("temple", "मंदिर परिसर"),
        title: "परिसर में बने जल कुंड",
        text: "पुराने समय की जल व्यवस्था का उदाहरण।",
      },
      {
        image: slideImage("crowd", "श्रद्धालुओं की भीड़"),
        title: "त्योहारों पर उमड़ती भीड़",
        text: "दर्शन के लिए सुबह का समय सबसे अच्छा रहता है।",
      },
    ],
  },
  {
    slug: "vanday-cricket-ke-6-record",
    title: "वनडे क्रिकेट के 6 सबसे बड़े रिकॉर्ड",
    category: cat("record"),
    publishedAt: minutesAgo(330),
    cover: slideImage("cricket", "फ़्लडलाइट में क्रिकेट मैदान"),
    articleId: "1062",
    slides: [
      {
        image: slideImage("cricket", "क्रिकेट का मैदान"),
        title: "सबसे बड़ा टीम स्कोर",
        text: "आंकड़े डेमो हैं और सिर्फ़ उदाहरण के लिए दिए गए हैं।",
      },
      {
        image: slideImage("cricket", "बल्ला और गेंद"),
        title: "सबसे तेज़ शतक",
        text: "रिकॉर्ड हर सीज़न में बदलते रहते हैं।",
      },
      {
        image: slideImage("crowd", "दर्शकों से भरा स्टेडियम"),
        title: "सबसे बड़ी जीत",
        text: "पूरी सूची ख़बर में पढ़ें।",
      },
      {
        image: slideImage("cricket", "स्टंप"),
        title: "सबसे ज़्यादा विकेट",
        text: "गेंदबाज़ों के रिकॉर्ड भी शामिल हैं।",
      },
    ],
  },
  {
    slug: "sardiyon-mein-ugayein-5-sabziyan",
    title: "सर्दियों में उगाएं ये 5 सब्ज़ियां",
    category: cat("lifestyle"),
    publishedAt: minutesAgo(360),
    cover: slideImage("farm", "खेत में हरी सब्ज़ियां"),
    articleId: "1102",
    slides: [
      {
        image: slideImage("farm", "क्यारी में पालक"),
        title: "गमले में भी उग जाती हैं",
        text: "छत या बालकनी में थोड़ी धूप हो तो काफ़ी है।",
      },
      {
        image: slideImage("farm", "हरी मेथी"),
        title: "20 दिन में तैयार",
        text: "पानी कम और धूप ज़्यादा — यही फ़ॉर्मूला है।",
      },
      {
        image: slideImage("farm", "सरसों का खेत"),
        title: "पूरी जानकारी पढ़ें",
        text: "बीज, मिट्टी और देखभाल के आसान सुझाव।",
      },
    ],
  },
  {
    slug: "antariksh-ke-8-rahasya",
    title: "अंतरिक्ष के 8 अनसुलझे रहस्य",
    category: cat("vigyan"),
    publishedAt: minutesAgo(450),
    cover: slideImage("space", "तारों भरा आसमान"),
    articleId: "1107",
    slides: [
      {
        image: slideImage("space", "तारों भरा आसमान"),
        title: "ब्रह्मांड का विस्तार",
        text: "वैज्ञानिक आज भी इसकी रफ़्तार पर शोध कर रहे हैं।",
      },
      {
        image: slideImage("space", "ग्रह और उपग्रह"),
        title: "दूसरे ग्रहों पर पानी",
        text: "नए मिशन इसी सवाल का जवाब खोज रहे हैं।",
      },
      {
        image: slideImage("space", "रॉकेट लॉन्च"),
        title: "आगे क्या",
        text: "पूरी सूची ख़बर में पढ़ें।",
      },
    ],
  },
  {
    slug: "is-hafte-ott-par-6-filmein",
    title: "इस हफ़्ते OTT पर आ रहीं 6 नई फ़िल्में",
    category: cat("ott"),
    publishedAt: minutesAgo(350),
    cover: slideImage("cinema", "सिनेमा हॉल की सीटें"),
    articleId: "1073",
    slides: [
      {
        image: slideImage("cinema", "सिनेमा स्क्रीन"),
        title: "वीकेंड की प्लानिंग तैयार",
        text: "छह फ़िल्में, तीन अलग-अलग भाषाओं में।",
      },
      {
        image: slideImage("cinema", "फ़िल्म रील"),
        title: "कौन-सी पहले देखें",
        text: "रेटिंग और अवधि के साथ पूरी सूची ख़बर में।",
      },
      {
        image: slideImage("cinema", "पॉपकॉर्न"),
        title: "पूरी लिस्ट पढ़ें",
        text: "स्ट्रीमिंग की तारीख़ भी शामिल है।",
      },
    ],
  },
  {
    slug: "phone-ki-battery-bachane-ke-7-tarike",
    title: "फ़ोन की बैटरी बचाने के 7 आसान तरीके",
    category: cat("mobile"),
    publishedAt: minutesAgo(400),
    cover: slideImage("tech", "स्मार्टफ़ोन और चिप"),
    articleId: "1090",
    slides: [
      {
        image: slideImage("tech", "स्मार्टफ़ोन की स्क्रीन"),
        title: "स्क्रीन ब्राइटनेस कम रखें",
        text: "ऑटो-ब्राइटनेस चालू करने से फ़र्क़ दिखता है।",
      },
      {
        image: slideImage("tech", "बैकग्राउंड ऐप"),
        title: "बैकग्राउंड ऐप बंद करें",
        text: "जिन ऐप का इस्तेमाल नहीं, उनका रिफ़्रेश रोकें।",
      },
      {
        image: slideImage("tech", "चार्जिंग केबल"),
        title: "बाक़ी 5 तरीके पढ़ें",
        text: "पूरी ख़बर में आसान सुझाव।",
      },
    ],
  },
];

export const webStoryBySlug: Record<string, WebStory> = Object.fromEntries(
  webStories.map((w) => [w.slug, w]),
);
