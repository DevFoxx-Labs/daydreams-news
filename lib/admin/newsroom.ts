import { authors } from "@/lib/data/authors";
import { MOCK_NOW_ISO, minutesAgo } from "@/lib/data/clock";
import { stories } from "@/lib/data/stories";
import { states } from "@/lib/data/states";
import type { Story } from "@/lib/data/types";

/**
 * Newsroom workload — the data the panels run on.
 *
 * Derived from the same mock stories the reader site uses, plus the editorial
 * tables the reader site has no need for (assignments, filings, payouts,
 * grievances, audit). When the CMS lands these become queries; the shape of
 * the returned objects is the contract the dashboards depend on.
 */

export type WorkflowStatus =
  | "assigned"
  | "draft"
  | "filed"
  | "in_review"
  | "needs_rewrite"
  | "scheduled"
  | "published"
  | "updated"
  | "spiked"
  | "legal_hold";

export const STATUS_LABEL: Record<WorkflowStatus, string> = {
  assigned: "असाइन",
  draft: "ड्राफ़्ट",
  filed: "भेजी गई",
  in_review: "समीक्षा में",
  needs_rewrite: "लौटाई गई",
  scheduled: "शेड्यूल",
  published: "प्रकाशित",
  updated: "अपडेटेड",
  spiked: "रद्द",
  legal_hold: "क़ानूनी रोक",
};

export type StoryRow = {
  id: string;
  title: string;
  status: WorkflowStatus;
  category: string;
  categorySlug: string;
  state?: string;
  city?: string;
  authorName: string;
  authorSlug: string;
  /** ISO. For queue items this is when it landed on the desk. */
  updatedAt: string;
  /** Minutes the item has waited — drives the SLA colour. */
  waitingMinutes?: number;
  isBreaking?: boolean;
  /** Breaking published but not yet reviewed (report §4.1). */
  postReviewPending?: boolean;
  views?: number;
  /** Another filing looks like this one (report §4.2). */
  duplicateOf?: string;
};

export type Assignment = {
  id: string;
  title: string;
  desk: string;
  assignedTo: string;
  assignedToName: string;
  state?: string;
  dueAt: string;
  status: "open" | "filed" | "done";
};

export type Filing = {
  id: string;
  title: string;
  stringerId: string;
  stringerName: string;
  district: string;
  districtName: string;
  state: string;
  filedAt: string;
  status: "filed" | "accepted" | "published" | "returned" | "rejected";
  /** ₹ per accepted story. */
  rate: number;
  payoutStatus: "pending" | "approved" | "paid";
  returnNote?: string;
};

export type Grievance = {
  id: string;
  ticket: string;
  type:
    | "access"
    | "correction"
    | "erasure"
    | "nomination"
    | "withdraw"
    | "content";
  subject: string;
  receivedAt: string;
  acknowledgedAt?: string;
  status: "open" | "acknowledged" | "resolved";
  /** Hours remaining against the 48h acknowledgement SLA. */
  ackDueInHours: number;
  resolveDueInDays: number;
};

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  sensitive: boolean;
};

const now = Date.parse(MOCK_NOW_ISO);
const minutesSince = (iso: string) => Math.round((now - Date.parse(iso)) / 60_000);

/** Deterministic pseudo-status so the queues look like a real desk. */
function statusFor(story: Story, index: number): WorkflowStatus {
  if (story.corrections?.length) return "updated";
  const bucket = (Number.parseInt(story.id, 10) + index) % 11;
  if (bucket === 0) return "in_review";
  if (bucket === 1) return "filed";
  if (bucket === 2) return "draft";
  if (bucket === 3) return "needs_rewrite";
  if (bucket === 4) return "scheduled";
  if (bucket === 5) return "spiked";
  return story.updatedAt ? "updated" : "published";
}

function toRow(story: Story, index: number): StoryRow {
  const status = statusFor(story, index);
  const at = story.updatedAt ?? story.publishedAt;
  return {
    id: story.id,
    title: story.title,
    status,
    category: story.subCategory?.name ?? story.category.name,
    categorySlug: story.category.slug,
    state: story.state,
    city: story.city,
    authorName: story.authors[0]?.name ?? "—",
    authorSlug: story.authors[0]?.slug ?? "",
    updatedAt: at,
    waitingMinutes:
      status === "in_review" || status === "filed" ? minutesSince(at) : undefined,
    isBreaking: story.isBreaking,
    postReviewPending: story.isBreaking && minutesSince(at) > 15 && index % 3 === 0,
    views: story.views,
  };
}

const ROWS: StoryRow[] = stories.map(toRow);

export type StoryQuery = {
  status?: WorkflowStatus | "all" | "queue";
  search?: string;
  state?: string;
  category?: string;
  authorSlug?: string;
  page?: number;
  perPage?: number;
};

export function queryStories(query: StoryQuery = {}) {
  const perPage = query.perPage ?? 20;
  const search = query.search?.trim().toLowerCase();

  let rows = ROWS.filter((row) => {
    if (query.status === "queue") {
      if (!["filed", "in_review", "needs_rewrite"].includes(row.status)) return false;
    } else if (query.status && query.status !== "all" && row.status !== query.status) {
      return false;
    }
    if (query.state && row.state !== query.state) return false;
    if (query.category && row.categorySlug !== query.category) return false;
    if (query.authorSlug && row.authorSlug !== query.authorSlug) return false;
    if (search && !row.title.toLowerCase().includes(search)) return false;
    return true;
  });

  // Queues are oldest-first (the SLA view); everything else is newest-first.
  rows =
    query.status === "queue"
      ? rows.sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
      : rows.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);

  return {
    rows: rows.slice((page - 1) * perPage, page * perPage),
    total,
    page,
    totalPages,
  };
}

export function reviewQueueCount(): number {
  return ROWS.filter((row) =>
    ["filed", "in_review", "needs_rewrite"].includes(row.status),
  ).length;
}

export function postReviewPending(): StoryRow[] {
  return ROWS.filter((row) => row.postReviewPending);
}

export function publishedToday(): number {
  return ROWS.filter(
    (row) =>
      ["published", "updated"].includes(row.status) &&
      minutesSince(row.updatedAt) < 24 * 60,
  ).length;
}

/** Median minutes from filing to publish — the desk's headline metric. */
export function medianFileToPublish(): number {
  const samples = ROWS.filter((row) => row.status === "published").map(
    (row, index) => 18 + ((Number.parseInt(row.id, 10) + index) % 90),
  );
  if (samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

// ── Assignments ────────────────────────────────────────────────────

const DESKS = ["देश", "राज्य", "बिज़नेस", "खेल", "मनोरंजन"];

export const assignments: Assignment[] = Array.from({ length: 9 }, (_, index) => {
  const author = authors[index % authors.length];
  return {
    id: `as-${index + 1}`,
    title:
      [
        "ज़िला अस्पताल में ऑक्सीजन प्लांट की स्थिति पर रिपोर्ट",
        "नए एक्सप्रेसवे के टोल रेट पर ग्राउंड रिपोर्ट",
        "बोर्ड परीक्षा केंद्रों की तैयारी",
        "मंडी में गेहूं ख़रीद की व्यवस्था",
        "शहर में पार्किंग के नए नियमों पर प्रतिक्रिया",
        "सर्दी में रैन बसेरों की हालत",
        "स्थानीय खेल अकादमी की सुविधाएं",
        "बिजली कटौती पर उपभोक्ताओं की शिकायत",
        "त्योहार पर ट्रेनों की उपलब्धता",
      ][index] ?? "असाइनमेंट",
    desk: DESKS[index % DESKS.length],
    assignedTo: author.slug,
    assignedToName: author.name,
    state: states[index % 6]?.slug,
    dueAt: minutesAgo(-(60 * (index + 1))),
    status: index % 4 === 0 ? "filed" : index % 5 === 0 ? "done" : "open",
  };
});

// ── Stringer filings & payouts ─────────────────────────────────────

const STRINGER_NAMES = [
  "ज़िला संवाददाता — गया",
  "ज़िला संवाददाता — पटना ग्रामीण",
  "ज़िला संवाददाता — भागलपुर",
  "ज़िला संवाददाता — मुज़फ़्फ़रपुर",
];

export const filings: Filing[] = Array.from({ length: 14 }, (_, index) => {
  const stringerIndex = index % STRINGER_NAMES.length;
  const bihar = states.find((state) => state.slug === "bihar");
  const city = bihar?.cities[stringerIndex % (bihar?.cities.length ?? 1)];
  const status = (
    ["filed", "accepted", "published", "returned", "published", "accepted"] as const
  )[index % 6];
  return {
    id: `fl-${index + 1}`,
    title:
      [
        "पंचायत भवन में बिजली नहीं, काम ठप",
        "नदी किनारे कटाव से दर्जन भर घर ख़तरे में",
        "सरकारी स्कूल में मध्याह्न भोजन की शिकायत",
        "सड़क हादसे में तीन घायल, जाम लगा",
        "किसानों ने खाद की किल्लत पर जताया रोष",
        "प्रखंड कार्यालय में शिविर, 200 आवेदन",
        "बाज़ार में अतिक्रमण के ख़िलाफ़ अभियान",
      ][index % 7] ?? "ज़िला ख़बर",
    stringerId: `u-stringer-${stringerIndex}`,
    stringerName: STRINGER_NAMES[stringerIndex],
    district: city?.slug ?? "gaya",
    districtName: city?.name ?? "गया",
    state: "bihar",
    filedAt: minutesAgo(30 + index * 95),
    status,
    rate: 250,
    payoutStatus:
      status === "published" ? "approved" : status === "accepted" ? "pending" : "pending",
    returnNote:
      status === "returned"
        ? "स्रोत का नाम और पुष्टि जोड़ें, फिर दोबारा भेजें।"
        : undefined,
  };
});

export function earningsFor(stringerId: string) {
  const mine = filings.filter((filing) => filing.stringerId === stringerId);
  const accepted = mine.filter((filing) =>
    ["accepted", "published"].includes(filing.status),
  );
  const paid = accepted.filter((filing) => filing.payoutStatus === "paid");
  return {
    filed: mine.length,
    accepted: accepted.length,
    acceptanceRate:
      mine.length > 0 ? Math.round((accepted.length / mine.length) * 100) : 0,
    earned: accepted.reduce((sum, filing) => sum + filing.rate, 0),
    paid: paid.reduce((sum, filing) => sum + filing.rate, 0),
    rows: mine,
  };
}

/** Districts with no filing today — the bureau chief's first screen. */
export function coverageGaps(stateSlug: string) {
  const state = states.find((entry) => entry.slug === stateSlug) ?? states[0];
  const today = filings.filter(
    (filing) => filing.state === state.slug && minutesSince(filing.filedAt) < 24 * 60,
  );
  const storiesToday = ROWS.filter(
    (row) => row.state === state.slug && minutesSince(row.updatedAt) < 24 * 60,
  );

  return state.cities.map((city) => {
    const filed =
      today.filter((filing) => filing.district === city.slug).length +
      storiesToday.filter((row) => row.city === city.slug).length;
    const lastAt =
      today.find((filing) => filing.district === city.slug)?.filedAt ??
      storiesToday.find((row) => row.city === city.slug)?.updatedAt;
    return {
      slug: city.slug,
      name: city.name,
      filedToday: filed,
      silentHours: lastAt ? Math.round(minutesSince(lastAt) / 60) : 72,
    };
  });
}

// ── Grievances & rights requests ───────────────────────────────────

export const grievances: Grievance[] = [
  {
    id: "gr-1",
    ticket: "KS-7F3A21",
    type: "erasure",
    subject: "न्यूज़लेटर से हटाने और डेटा मिटाने का अनुरोध",
    receivedAt: minutesAgo(90),
    status: "open",
    ackDueInHours: 46,
    resolveDueInDays: 30,
  },
  {
    id: "gr-2",
    ticket: "KS-7F2C09",
    type: "content",
    subject: "ख़बर में नाम की वर्तनी ग़लत — सुधार की मांग",
    receivedAt: minutesAgo(600),
    acknowledgedAt: minutesAgo(560),
    status: "acknowledged",
    ackDueInHours: 38,
    resolveDueInDays: 29,
  },
  {
    id: "gr-3",
    ticket: "KS-7E9B44",
    type: "access",
    subject: "मेरी कौन-सी जानकारी आपके पास है, ब्योरा चाहिए",
    receivedAt: minutesAgo(2_700),
    acknowledgedAt: minutesAgo(2_650),
    status: "acknowledged",
    ackDueInHours: 2,
    resolveDueInDays: 28,
  },
  {
    id: "gr-4",
    ticket: "KS-7E4410",
    type: "withdraw",
    subject: "विज्ञापन सहमति वापस लेने की पुष्टि चाहिए",
    receivedAt: minutesAgo(5_000),
    acknowledgedAt: minutesAgo(4_980),
    status: "resolved",
    ackDueInHours: 0,
    resolveDueInDays: 26,
  },
];

export function grievanceQueueCount(): number {
  return grievances.filter((entry) => entry.status !== "resolved").length;
}

// ── Audit log ──────────────────────────────────────────────────────

export const auditLog: AuditEntry[] = [
  {
    id: "au-1",
    at: minutesAgo(10),
    actor: "डेस्क एडिटर (डेमो)",
    action: "ब्रेकिंग प्रकाशित",
    target: "उत्तर भारत में कोहरे और ठंड का डबल अटैक",
    sensitive: true,
  },
  {
    id: "au-2",
    at: minutesAgo(26),
    actor: "डेस्क एडिटर (डेमो)",
    action: "होम पेज हीरो बदला",
    target: "slot: hero",
    sensitive: false,
  },
  {
    id: "au-3",
    at: minutesAgo(48),
    actor: "प्रधान संपादक (डेमो)",
    action: "सुधार जोड़ा",
    target: "पेंशन नियमों में बदलाव",
    sensitive: false,
  },
  {
    id: "au-4",
    at: minutesAgo(120),
    actor: "सिस्टम एडमिन (डेमो)",
    action: "रोल बदला",
    target: "u-reporter → sub_editor (वापस लिया गया)",
    sensitive: true,
  },
  {
    id: "au-5",
    at: minutesAgo(210),
    actor: "शिकायत निवारण अधिकारी (डेमो)",
    action: "सहमति रिकॉर्ड देखा",
    target: "visitor a1b2c3d4…",
    sensitive: true,
  },
  {
    id: "au-6",
    at: minutesAgo(320),
    actor: "ब्यूरो चीफ, बिहार (डेमो)",
    action: "पेआउट सिफ़ारिश भेजी",
    target: "बिहार · नवंबर · ₹14,500",
    sensitive: false,
  },
];

// ── Trends for the dashboard chart ─────────────────────────────────

export function publishTrend(): { label: string; count: number }[] {
  return Array.from({ length: 14 }, (_, index) => {
    const day = 13 - index;
    const date = new Date(now - day * 86_400_000);
    return {
      label: `${date.getUTCDate()}/${date.getUTCMonth() + 1}`,
      count: 18 + ((day * 7 + 3) % 17),
    };
  });
}

export function topStoriesNow(limit = 6): StoryRow[] {
  return [...ROWS]
    .filter((row) => ["published", "updated"].includes(row.status))
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, limit);
}
