import { cat } from "./categories";
import { minutesAgo } from "./clock";
import type { LiveBlog } from "./types";

/**
 * Demo live blog — FR-L1. The first four updates are what the homepage
 * "लाइव अपडेट" box shows (FR-H2).
 */
export const liveBlogs: LiveBlog[] = [
  {
    id: "2001",
    slug: "uttar-bharat-mausam-live-updates",
    title: "उत्तर भारत मौसम LIVE: कोहरे और ठंड पर हर अपडेट",
    summary:
      "पंजाब से बिहार तक घने कोहरे का असर। उड़ानों, ट्रेनों और स्कूलों से जुड़ी हर जानकारी एक जगह।",
    keyEvents: [
      "5 राज्यों में घने कोहरे का ऑरेंज अलर्ट",
      "दिल्ली एयरपोर्ट पर 40 से ज़्यादा उड़ानें देरी से",
      "यूपी के 18 ज़िलों में स्कूल का समय बदला",
      "रेलवे ने 22 ट्रेनों का समय बदला",
    ],
    status: "live",
    startedAt: minutesAgo(420),
    updatedAt: minutesAgo(12),
    category: cat("mausam"),
    image: {
      scene: "rain",
      alt: "कोहरे के बीच सुबह का नज़ारा (प्रतीकात्मक तस्वीर)",
      width: 1600,
      height: 900,
      isFile: true,
    },
    updates: [
      {
        id: "u-7",
        time: minutesAgo(12),
        title: "दिल्ली एयरपोर्ट पर 40 उड़ानें देरी से",
        isPinned: true,
        body: [
          {
            type: "paragraph",
            text: "एयरपोर्ट प्रशासन ने यात्रियों से फ़्लाइट स्टेटस जांचने की अपील की है। कुछ उड़ानों को दूसरे शहरों की ओर मोड़ा गया है। (डेमो अपडेट)",
          },
        ],
      },
      {
        id: "u-6",
        time: minutesAgo(29),
        title: "यूपी के 18 ज़िलों में स्कूल 10 बजे से खुलेंगे",
        body: [
          {
            type: "paragraph",
            text: "ठंड और कोहरे को देखते हुए प्राथमिक स्कूलों का समय बदला गया है। आदेश अगले आदेश तक लागू रहेगा। (डेमो अपडेट)",
          },
        ],
      },
      {
        id: "u-5",
        time: minutesAgo(50),
        title: "पंजाब-हरियाणा में विज़िबिलिटी 50 मीटर से कम",
      },
      {
        id: "u-4",
        time: minutesAgo(75),
        title: "रेलवे ने 22 ट्रेनों का समय बदला, देखें लिस्ट",
        body: [
          {
            type: "table",
            head: ["ट्रेन", "पुराना समय", "नया समय"],
            rows: [
              ["डेमो एक्सप्रेस 10101", "06:10", "08:40"],
              ["डेमो इंटरसिटी 10203", "07:25", "09:15"],
              ["डेमो सुपरफ़ास्ट 10305", "08:00", "10:30"],
            ],
          },
        ],
      },
      {
        id: "u-3",
        time: minutesAgo(140),
        title: "हाईवे पर रात के समय भारी वाहनों की रफ़्तार सीमित",
      },
      {
        id: "u-2",
        time: minutesAgo(240),
        title: "मौसम विभाग ने 5 राज्यों के लिए ऑरेंज अलर्ट जारी किया",
      },
      {
        id: "u-1",
        time: minutesAgo(420),
        title: "पहाड़ों पर बर्फ़बारी के बाद मैदानी इलाकों में ठंडी हवाएं",
      },
    ],
  },
  {
    id: "2002",
    slug: "doosra-ekdivasiya-live",
    title: "दूसरा वनडे LIVE: भारत की पारी जारी",
    summary: "टॉस, प्लेइंग इलेवन और हर ओवर का हाल। (डेमो स्कोर)",
    keyEvents: ["भारत ने टॉस जीतकर बल्लेबाज़ी चुनी", "युवा बल्लेबाज़ का शतक"],
    status: "live",
    startedAt: minutesAgo(200),
    updatedAt: minutesAgo(18),
    category: cat("cricket"),
    image: {
      scene: "cricket",
      alt: "क्रिकेट स्टेडियम (प्रतीकात्मक तस्वीर)",
      width: 1600,
      height: 900,
      isFile: true,
    },
    updates: [
      { id: "c-4", time: minutesAgo(18), title: "42 ओवर के बाद भारत 287/4" },
      { id: "c-3", time: minutesAgo(45), title: "युवा बल्लेबाज़ का शतक पूरा" },
      { id: "c-2", time: minutesAgo(120), title: "पहले 10 ओवर में 62 रन" },
      { id: "c-1", time: minutesAgo(200), title: "भारत ने टॉस जीतकर बल्लेबाज़ी चुनी" },
    ],
  },
  {
    id: "2003",
    slug: "board-pariksha-datesheet-live",
    title: "बोर्ड परीक्षा डेटशीट LIVE: हर जानकारी",
    summary: "डेटशीट, परीक्षा केंद्र और गाइडलाइन से जुड़े अपडेट।",
    keyEvents: ["डेटशीट अगले हफ़्ते जारी होगी"],
    status: "ended",
    startedAt: minutesAgo(1600),
    updatedAt: minutesAgo(1200),
    category: cat("board"),
    image: {
      scene: "school",
      alt: "ब्लैकबोर्ड और किताबें (प्रतीकात्मक तस्वीर)",
      width: 1600,
      height: 900,
      isFile: true,
    },
    updates: [
      {
        id: "b-2",
        time: minutesAgo(1200),
        title: "लाइव कवरेज समाप्त, विस्तृत ख़बर पढ़ें",
      },
      { id: "b-1", time: minutesAgo(1600), title: "बोर्ड ने गाइडलाइन जारी की" },
    ],
  },
];
