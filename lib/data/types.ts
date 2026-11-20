/**
 * Content model — DESIGN.md §9 and PRD §11.
 * These types are the contract between the reader site and whatever supplies
 * the content. Today it is `lib/data/*` (mock); later it will be the CMS.
 * Components must never import the mock files directly — only `lib/cms`.
 */

export type SceneKey =
  | "city"
  | "rain"
  | "cricket"
  | "market"
  | "tech"
  | "hills"
  | "cinema"
  | "road"
  | "school"
  | "farm"
  | "temple"
  | "space"
  | "crowd"
  | "hospital";

export type Category = {
  slug: string;
  name: string;
  /** Shown in the main nav bar (FR-G1); others live under "और ▾". */
  inNav?: boolean;
  children?: Category[];
};

export type Author = {
  slug: string;
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  social?: { x?: string; linkedin?: string };
};

export type Media = {
  /** Empty while the demo uses generated scenes; a CDN URL once the CMS is in. */
  url?: string;
  /** Deterministic illustration used in place of a photograph (demo only). */
  scene?: SceneKey;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
  /** File photo / illustration ⇒ caption gets "(प्रतीकात्मक तस्वीर)". */
  isFile?: boolean;
  /** AI-generated illustration ⇒ forced AI caption (GRAPHICS_PROMPTS §0). */
  isAiGenerated?: boolean;
};

export type StoryType =
  | "article"
  | "live"
  | "video"
  | "gallery"
  | "webstory";

export type RichTextBlock =
  | { type: "paragraph"; text: string; dateline?: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; style: "bullet" | "number"; items: string[] }
  | { type: "image"; media: Media }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "readAlso"; storyId: string }
  | { type: "embed"; provider: "youtube" | "x" | "instagram" | "facebook"; id: string; title: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "infoBox"; title: string; items: string[] };

export type Correction = {
  text: string;
  correctedAt: string;
};

export type Story = {
  id: string;
  slug: string;
  type: StoryType;
  title: string;
  /** ≤ 65 chars for search results (PRD §7.2). */
  seoTitle?: string;
  deck?: string;
  highlights?: string[];
  category: Category;
  subCategory?: Category;
  /** State / city slugs (FR-C1). */
  state?: string;
  city?: string;
  image: Media;
  authors: Author[];
  dateline?: string;
  publishedAt: string;
  updatedAt?: string;
  readMinutes?: number;
  body?: RichTextBlock[];
  tags?: string[];
  isLive?: boolean;
  isBreaking?: boolean;
  /** FR-A9 — "प्रायोजित" label + rel="sponsored". */
  isSponsored?: boolean;
  videoId?: string;
  videoDuration?: string;
  photoCount?: number;
  /** Demo page-view count used by "सबसे ज़्यादा पढ़ी गईं" (FR-H4). */
  views?: number;
  corrections?: Correction[];
  noindex?: boolean;
};

export type LiveUpdate = {
  id: string;
  time: string;
  title: string;
  body?: RichTextBlock[];
  isPinned?: boolean;
};

export type LiveBlog = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  keyEvents: string[];
  status: "live" | "ended";
  startedAt: string;
  updatedAt: string;
  category: Category;
  image: Media;
  updates: LiveUpdate[];
};

export type WebStorySlide = {
  image: Media;
  title: string;
  text?: string;
};

export type WebStory = {
  slug: string;
  title: string;
  category: Category;
  publishedAt: string;
  cover: Media;
  slides: WebStorySlide[];
  /** CTA on the last slide → the full article. */
  articleId?: string;
};

export type Gallery = {
  slug: string;
  title: string;
  category: Category;
  publishedAt: string;
  images: Media[];
};

export type TickerItem = {
  id: string;
  text: string;
  href: string;
  publishedAt: string;
  /** FR-G2 — item disappears after this instant. */
  expiresAt: string;
};

export type TrendingTag = {
  label: string;
  slug: string;
};

export type IndianState = {
  slug: string;
  name: string;
  /** Shown in the home strip and the menu grid. */
  featured?: boolean;
  cities: { slug: string; name: string }[];
};

export type RashiSign = {
  slug: string;
  name: string;
  glyph: string;
  dates: string;
  today: string;
};

export type StaticPage = {
  slug: string;
  title: string;
  version: string;
  lastUpdated: string;
  /** Rendered with article typography (DESIGN.md §7). */
  body: RichTextBlock[];
};

/** Home curation (FR-H1 / PRD §7.4) — pinned slots, auto-filled when empty. */
export type HomeCuration = {
  heroId?: string;
  secondaryIds: string[];
  topNewsIds: string[];
  mostReadIds?: string[];
  featuredLiveBlogId?: string;
  categoryLeadIds: Record<string, string | undefined>;
};
