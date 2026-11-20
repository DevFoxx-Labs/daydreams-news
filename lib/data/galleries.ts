import { cat } from "./categories";
import { minutesAgo } from "./clock";
import type { Gallery, Media, SceneKey } from "./types";

function img(scene: SceneKey, caption: string): Media {
  return {
    scene,
    alt: caption,
    width: 1600,
    height: 900,
    caption,
    credit: "ख़बर सेतु",
    isFile: true,
  };
}

/** Photo galleries — DESIGN.md §5.8 bento grid links here (FR-P1). */
export const galleries: Gallery[] = [
  {
    slug: "barf-se-dhake-pahad",
    title: "बर्फ़ से ढके पहाड़, तस्वीरों में देखें नज़ारा",
    category: cat("safar"),
    publishedAt: minutesAgo(260),
    images: [
      img("hills", "सुबह की पहली धूप में चमकती बर्फ़ीली चोटियां।"),
      img("hills", "घाटी में फैली बर्फ़ की चादर।"),
      img("road", "बर्फ़ हटाने के बाद खोला गया पहाड़ी रास्ता।"),
      img("temple", "कस्बे का पुराना मंदिर, बर्फ़ के बीच।"),
      img("crowd", "बर्फ़बारी देखने पहुंचे पर्यटक।"),
      img("hills", "शाम ढलते ही गिरता तापमान।"),
      img("city", "कस्बे के बाज़ार में चहल-पहल।"),
      img("hills", "देवदार के पेड़ों पर जमी बर्फ़।"),
      img("road", "सड़क किनारे जमी बर्फ़ की परत।"),
      img("hills", "दूर से दिखती बर्फ़ीली श्रृंखला।"),
      img("crowd", "स्थानीय लोग और पर्यटक एक साथ।"),
      img("hills", "रात से पहले का आख़िरी नज़ारा।"),
    ],
  },
  {
    slug: "mandir-ki-vastukala",
    title: "मंदिर की वास्तुकला, तस्वीरों में",
    category: cat("mandir"),
    publishedAt: minutesAgo(380),
    images: [
      img("temple", "मुख्य शिखर की नक्काशी।"),
      img("temple", "प्रवेश द्वार का पुराना पत्थर।"),
      img("temple", "परिसर में बना जल कुंड।"),
      img("crowd", "दर्शन के लिए लगी कतार।"),
      img("temple", "दीपों से सजा परिसर।"),
      img("temple", "छत पर बनी आकृतियां।"),
      img("crowd", "त्योहार के दिन की भीड़।"),
      img("temple", "सूर्यास्त के समय मंदिर।"),
    ],
  },
  {
    slug: "mele-ki-rangeen-tasveerein",
    title: "मेले की रंगीन तस्वीरें",
    category: cat("samaj"),
    publishedAt: minutesAgo(420),
    images: [
      img("crowd", "मेले में उमड़ी भीड़।"),
      img("crowd", "झूलों के पास बच्चों की कतार।"),
      img("city", "मेले का मुख्य प्रवेश द्वार।"),
      img("crowd", "हस्तशिल्प की दुकानें।"),
      img("farm", "ग्रामीण उत्पादों का स्टॉल।"),
      img("crowd", "सांस्कृतिक कार्यक्रम की तैयारी।"),
      img("city", "शाम को जगमगाता मेला परिसर।"),
      img("crowd", "खाने-पीने के स्टॉल पर भीड़।"),
      img("crowd", "मेले में तैनात सुरक्षा कर्मी।"),
      img("city", "पार्किंग की व्यवस्था।"),
      img("crowd", "मेले से लौटते लोग।"),
      img("crowd", "रात के कार्यक्रम का मंच।"),
      img("city", "सजावट की रोशनी।"),
      img("crowd", "मेले का आख़िरी दिन।"),
      img("crowd", "समापन समारोह।"),
    ],
  },
  {
    slug: "match-ki-yaadgar-tasveerein",
    title: "मैच की यादगार तस्वीरें",
    category: cat("cricket"),
    publishedAt: minutesAgo(450),
    images: [
      img("cricket", "टॉस के समय मैदान का नज़ारा।"),
      img("cricket", "पहली गेंद से पहले तैयारी।"),
      img("crowd", "दर्शकों से भरा स्टेडियम।"),
      img("cricket", "शतक पूरा होने का पल।"),
      img("cricket", "फ़ील्डिंग के दौरान।"),
      img("crowd", "दर्शकों का जोश।"),
      img("cricket", "फ़्लडलाइट में मैदान।"),
      img("cricket", "पारी के आख़िरी ओवर।"),
      img("crowd", "मैच के बाद का माहौल।"),
      img("cricket", "खाली मैदान, मैच के बाद।"),
    ],
  },
  {
    slug: "khet-khalihan-ki-tasveerein",
    title: "खेत-खलिहान की तस्वीरें",
    category: cat("krishi"),
    publishedAt: minutesAgo(540),
    images: [
      img("farm", "रबी की बुवाई शुरू।"),
      img("farm", "खेत में ट्रैक्टर।"),
      img("farm", "सिंचाई की तैयारी।"),
      img("farm", "हरी फ़सल का खेत।"),
      img("farm", "खलिहान में रखी उपज।"),
      img("farm", "शाम को लौटते किसान।"),
    ],
  },
];

export const galleryBySlug: Record<string, Gallery> = Object.fromEntries(
  galleries.map((g) => [g.slug, g]),
);
