import { cacheLife, cacheTag } from "next/cache";

import { authorBySlug, authors } from "@/lib/data/authors";
import { categories, categoryBySlug, navCategories } from "@/lib/data/categories";
import { MOCK_NOW_ISO, now } from "@/lib/data/clock";
import {
  homeCuration,
  rashiSigns,
  tickerItems,
  trendingTags,
} from "@/lib/data/editorial";
import { galleries, galleryBySlug } from "@/lib/data/galleries";
import { liveBlogs } from "@/lib/data/live";
import { stories } from "@/lib/data/stories";
import { featuredStates, stateBySlug, states } from "@/lib/data/states";
import type {
  Author,
  Category,
  Gallery,
  IndianState,
  LiveBlog,
  RashiSign,
  Story,
  TickerItem,
  TrendingTag,
  WebStory,
} from "@/lib/data/types";
import { webStories, webStoryBySlug } from "@/lib/data/webstories";
import { buildSearchIndex, matchesQuery, normalise } from "@/lib/search/translit";

/**
 * Data-access layer (PRD §11 `lib/cms`).
 *
 * Pages and components read content **only** through this module. Today it
 * serves typed mock data from `lib/data/*`; swapping in Payload/Sanity means
 * replacing the bodies of these functions and nothing else.
 *
 * Caching mirrors FR-G6: home and category lists revalidate every 60s
 * (`cacheLife('minutes')`), articles are long-lived and tagged so the CMS
 * publish webhook can revalidate one story on demand.
 */

const PER_PAGE = 20;

// ──────────────────────────────────────────────────────────────────
// Internal helpers (not cached — pure functions over in-memory data)
// ──────────────────────────────────────────────────────────────────

const byNewest = (a: Story, b: Story) =>
  Date.parse(b.publishedAt) - Date.parse(a.publishedAt);

const published = () => stories;

/** Readable stories only — galleries and web stories have their own routes. */
const readable = () =>
  published().filter((s) => s.type !== "webstory" && s.type !== "gallery");

function inCategory(story: Story, slug: string): boolean {
  if (story.category.slug === slug) return true;
  if (story.subCategory?.slug === slug) return true;
  return false;
}

function pick(ids: string[]): Story[] {
  return ids
    .map((id) => published().find((s) => s.id === id))
    .filter((s): s is Story => Boolean(s));
}

/** Pinned ids first, then the latest stories of that pool, without repeats. */
function fillSlots(pinned: Story[], pool: Story[], count: number): Story[] {
  const out = [...pinned];
  const seen = new Set(out.map((s) => s.id));
  for (const story of pool) {
    if (out.length >= count) break;
    if (seen.has(story.id)) continue;
    out.push(story);
    seen.add(story.id);
  }
  return out.slice(0, count);
}

const searchIndexes = new Map<string, string>();

function searchIndexFor(story: Story): string {
  const cached = searchIndexes.get(story.id);
  if (cached) return cached;
  const bodyText = (story.body ?? [])
    .map((block) => {
      if (block.type === "paragraph") return block.text;
      if (block.type === "heading") return block.text;
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "quote") return block.text;
      return "";
    })
    .join(" ");
  const index = buildSearchIndex([
    story.title,
    story.deck,
    story.category.name,
    story.subCategory?.name,
    (story.tags ?? []).join(" "),
    story.slug.replace(/-/g, " "),
    bodyText,
  ]);
  searchIndexes.set(story.id, index);
  return index;
}

// ──────────────────────────────────────────────────────────────────
// Taxonomy
// ──────────────────────────────────────────────────────────────────

export async function getNavCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  return navCategories;
}

export async function getAllCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  return categories;
}

export async function getCategory(slug: string): Promise<Category | null> {
  "use cache";
  cacheLife("hours");
  return categoryBySlug[slug] ?? null;
}

export async function getStates(): Promise<IndianState[]> {
  "use cache";
  cacheLife("hours");
  return states;
}

export async function getFeaturedStates(): Promise<IndianState[]> {
  "use cache";
  cacheLife("hours");
  return featuredStates;
}

export async function getState(slug: string): Promise<IndianState | null> {
  "use cache";
  cacheLife("hours");
  return stateBySlug[slug] ?? null;
}

export async function getAuthors(): Promise<Author[]> {
  "use cache";
  cacheLife("hours");
  return authors;
}

export async function getAuthor(slug: string): Promise<Author | null> {
  "use cache";
  cacheLife("hours");
  return authorBySlug[slug] ?? null;
}

// ──────────────────────────────────────────────────────────────────
// Editorial surfaces
// ──────────────────────────────────────────────────────────────────

/** FR-G2 — active breaking items, newest first, max 6, expired ones dropped. */
export async function getTicker(): Promise<TickerItem[]> {
  "use cache";
  cacheLife("minutes");
  const reference = Date.parse(MOCK_NOW_ISO);
  return tickerItems
    .filter((item) => Date.parse(item.expiresAt) > reference)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 6);
}

export async function getTrendingTags(): Promise<TrendingTag[]> {
  "use cache";
  cacheLife("minutes");
  return trendingTags.slice(0, 10);
}

/** FR-H4 — most read in the last 24h; falls back to the editor's list. */
export async function getMostRead(count = 6): Promise<Story[]> {
  "use cache";
  cacheLife("minutes");
  const recent = readable()
    .filter(
      (s) =>
        Date.parse(MOCK_NOW_ISO) - Date.parse(s.publishedAt) <= 24 * 3_600_000,
    )
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
  if (recent.length >= count) return recent.slice(0, count);
  return fillSlots(recent, pick(homeCuration.mostReadIds ?? []), count);
}

export async function getBreakingStories(count = 4): Promise<Story[]> {
  "use cache";
  cacheLife("minutes");
  return readable()
    .filter((s) => s.isBreaking)
    .sort(byNewest)
    .slice(0, count);
}

export async function getLatest(count = 10): Promise<Story[]> {
  "use cache";
  cacheLife("minutes");
  return readable().sort(byNewest).slice(0, count);
}

// ──────────────────────────────────────────────────────────────────
// Stories
// ──────────────────────────────────────────────────────────────────

export async function getStory(id: string): Promise<Story | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`story-${id}`);
  return published().find((s) => s.id === id) ?? null;
}

/**
 * Resolves `/<category>/<slug>-<id>`. The id is authoritative; a stale slug
 * still finds the story so the page can 301 to the canonical URL (SEO-1).
 */
export async function getStoryByPath(
  categorySlug: string,
  id: string,
): Promise<Story | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`story-${id}`);
  const story = published().find((s) => s.id === id);
  if (!story) return null;
  if (story.category.slug !== categorySlug) return null;
  return story;
}

/** FR-A8 — 3 related stories: shared tags, then category, then recency. */
export async function getRelatedStories(
  id: string,
  count = 3,
): Promise<Story[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`story-${id}`);
  const story = published().find((s) => s.id === id);
  if (!story) return [];

  const tags = new Set(story.tags ?? []);
  const candidates = readable().filter((s) => s.id !== story.id);

  const scored = candidates
    .map((candidate) => {
      const shared = (candidate.tags ?? []).filter((tag) => tags.has(tag)).length;
      const sameCategory = candidate.category.slug === story.category.slug ? 1 : 0;
      const sameSub =
        candidate.subCategory?.slug &&
        candidate.subCategory.slug === story.subCategory?.slug
          ? 1
          : 0;
      return { candidate, score: shared * 10 + sameCategory * 3 + sameSub * 2 };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.candidate.publishedAt) - Date.parse(a.candidate.publishedAt),
    );

  return scored.slice(0, count).map((s) => s.candidate);
}

/** The story used for an auto-inserted "यह भी पढ़ें" box (FR-A3). */
export async function getReadAlsoStory(id: string): Promise<Story | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`story-${id}`);
  const related = await getRelatedStories(id, 1);
  return related[0] ?? null;
}

export type StoryListPage = {
  stories: Story[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

function paginate(list: Story[], page: number, perPage = PER_PAGE): StoryListPage {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    stories: list.slice(start, start + perPage),
    total,
    page: current,
    perPage,
    totalPages,
  };
}

/** FR-C2 — category lead block + paginated list. */
export async function getCategoryStories(
  slug: string,
  options: { page?: number; sub?: string } = {},
): Promise<StoryListPage> {
  "use cache";
  cacheLife("minutes");
  const filterSlug = options.sub ?? slug;
  const list = readable()
    .filter((s) => inCategory(s, filterSlug))
    .sort(byNewest);
  return paginate(list, options.page ?? 1);
}

export async function getCategoryLead(slug: string): Promise<Story | null> {
  "use cache";
  cacheLife("minutes");
  const pinnedId = homeCuration.categoryLeadIds[slug];
  const pool = readable()
    .filter((s) => inCategory(s, slug))
    .sort(byNewest);
  const pinned = pinnedId ? pick([pinnedId]) : [];
  return fillSlots(pinned, pool, 1)[0] ?? null;
}

/** FR-H3 / FR-C3 — state and city feeds. */
export async function getStateStories(
  stateSlug: string,
  options: { city?: string; page?: number; count?: number } = {},
): Promise<StoryListPage> {
  "use cache";
  cacheLife("minutes");
  const list = readable()
    .filter(
      (s) =>
        s.state === stateSlug && (!options.city || s.city === options.city),
    )
    .sort(byNewest);
  return paginate(list, options.page ?? 1, options.count ?? PER_PAGE);
}

export async function getAuthorStories(
  slug: string,
  page = 1,
): Promise<StoryListPage> {
  "use cache";
  cacheLife("minutes");
  const list = readable()
    .filter((s) => s.authors.some((a) => a.slug === slug))
    .sort(byNewest);
  return paginate(list, page);
}

export async function getTagStories(
  tagSlug: string,
  page = 1,
): Promise<StoryListPage> {
  "use cache";
  cacheLife("minutes");
  const needle = normalise(tagSlug.replace(/-/g, " "));
  const list = readable()
    .filter((s) =>
      (s.tags ?? []).some(
        (tag) =>
          normalise(tag) === needle ||
          matchesQuery(buildSearchIndex([tag]), needle),
      ),
    )
    .sort(byNewest);
  return paginate(list, page);
}

export async function getVideoStories(count = 12): Promise<Story[]> {
  "use cache";
  cacheLife("minutes");
  return published()
    .filter((s) => s.type === "video")
    .sort(byNewest)
    .slice(0, count);
}

export async function getVideoStory(id: string): Promise<Story | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`story-${id}`);
  const story = published().find((s) => s.id === id && s.type === "video");
  return story ?? null;
}

/** Home "बिज़नेस · टेक · ऑटो · नौकरी" block — one story per category. */
export async function getBizGrid(): Promise<Story[]> {
  "use cache";
  cacheLife("minutes");
  const wanted = ["business", "tech", "auto", "naukri"];
  return wanted
    .map((slug) =>
      readable()
        .filter((s) => inCategory(s, slug))
        .sort(byNewest)[0],
    )
    .filter((s): s is Story => Boolean(s));
}

// ──────────────────────────────────────────────────────────────────
// Search (FR-S1 … FR-S3)
// ──────────────────────────────────────────────────────────────────

export type SearchRange = "24h" | "7d" | "30d" | "any";
export type SearchSort = "relevance" | "latest";

export type SearchParams = {
  q: string;
  category?: string;
  range?: SearchRange;
  sort?: SearchSort;
  page?: number;
};

const RANGE_HOURS: Record<SearchRange, number | null> = {
  "24h": 24,
  "7d": 24 * 7,
  "30d": 24 * 30,
  any: null,
};

export async function searchStories(
  params: SearchParams,
): Promise<StoryListPage> {
  "use cache";
  cacheLife("minutes");
  const query = params.q.trim();
  if (!query) return paginate([], 1);

  const hours = RANGE_HOURS[params.range ?? "any"];
  const reference = Date.parse(MOCK_NOW_ISO);

  let list = readable().filter((story) => {
    if (params.category && !inCategory(story, params.category)) return false;
    if (hours && reference - Date.parse(story.publishedAt) > hours * 3_600_000) {
      return false;
    }
    return matchesQuery(searchIndexFor(story), query);
  });

  if (params.sort === "latest") {
    list = list.sort(byNewest);
  } else {
    const needle = normalise(query);
    list = list.sort((a, b) => {
      const aTitle = normalise(a.title).includes(needle) ? 1 : 0;
      const bTitle = normalise(b.title).includes(needle) ? 1 : 0;
      return bTitle - aTitle || byNewest(a, b);
    });
  }

  return paginate(list, params.page ?? 1);
}

/** FR-S3 — up to 5 suggestions after 2 characters. */
export async function getSearchSuggestions(query: string): Promise<string[]> {
  "use cache";
  cacheLife("minutes");
  if (query.trim().length < 2) return [];
  const result = await searchStories({ q: query, sort: "relevance" });
  return result.stories.slice(0, 5).map((s) => s.title);
}

// ──────────────────────────────────────────────────────────────────
// Live blogs, web stories, galleries, rashifal
// ──────────────────────────────────────────────────────────────────

export async function getLiveBlogs(): Promise<LiveBlog[]> {
  "use cache";
  cacheLife("minutes");
  return liveBlogs;
}

export async function getLiveBlog(slug: string): Promise<LiveBlog | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`live-${slug}`);
  return liveBlogs.find((b) => b.slug === slug) ?? null;
}

/** FR-H2 — the live box on the homepage follows the curated live blog. */
export async function getFeaturedLiveBlog(): Promise<LiveBlog | null> {
  "use cache";
  cacheLife("minutes");
  const id = homeCuration.featuredLiveBlogId;
  return liveBlogs.find((b) => b.id === id) ?? liveBlogs[0] ?? null;
}

export async function getWebStories(): Promise<WebStory[]> {
  "use cache";
  cacheLife("minutes");
  return [...webStories].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export async function getWebStory(slug: string): Promise<WebStory | null> {
  "use cache";
  cacheLife("days");
  return webStoryBySlug[slug] ?? null;
}

export async function getGalleries(): Promise<Gallery[]> {
  "use cache";
  cacheLife("minutes");
  return [...galleries].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
}

export async function getGallery(slug: string): Promise<Gallery | null> {
  "use cache";
  cacheLife("days");
  return galleryBySlug[slug] ?? null;
}

export async function getRashiSigns(): Promise<RashiSign[]> {
  "use cache";
  cacheLife("hours");
  return rashiSigns;
}

export async function getRashiSign(slug: string): Promise<RashiSign | null> {
  "use cache";
  cacheLife("hours");
  return rashiSigns.find((r) => r.slug === slug) ?? null;
}

// ──────────────────────────────────────────────────────────────────
// Homepage aggregate (FR-H1 … FR-H6)
// ──────────────────────────────────────────────────────────────────

export type HomeData = {
  hero: Story;
  secondary: Story[];
  topNews: Story[];
  liveBlog: LiveBlog | null;
  liveBreaking: Story[];
  mostRead: Story[];
  deshLead: Story | null;
  deshList: Story[];
  duniyaLead: Story | null;
  duniyaList: Story[];
  webStories: WebStory[];
  cricketStory: Story | null;
  entertainmentLead: Story | null;
  entertainmentList: Story[];
  videoMain: Story | null;
  videoList: Story[];
  bizGrid: Story[];
  galleries: Gallery[];
  rashiSigns: RashiSign[];
};

export async function getHomeData(): Promise<HomeData> {
  "use cache";
  cacheLife("minutes");

  const pool = readable().sort(byNewest);
  const hero = fillSlots(
    homeCuration.heroId ? pick([homeCuration.heroId]) : [],
    pool,
    1,
  )[0];
  const secondary = fillSlots(
    pick(homeCuration.secondaryIds),
    pool.filter((s) => s.id !== hero.id),
    2,
  );
  const used = new Set([hero.id, ...secondary.map((s) => s.id)]);
  const topNews = fillSlots(
    pick(homeCuration.topNewsIds),
    pool.filter((s) => !used.has(s.id)),
    5,
  );

  const [
    liveBlog,
    liveBreaking,
    mostRead,
    deshLead,
    duniyaLead,
    deshPage,
    duniyaPage,
    webStoryList,
    entertainmentLead,
    entertainmentPage,
    videos,
    bizGrid,
    galleryList,
    signs,
  ] = await Promise.all([
    getFeaturedLiveBlog(),
    getBreakingStories(4),
    getMostRead(6),
    getCategoryLead("desh"),
    getCategoryLead("duniya"),
    getCategoryStories("desh"),
    getCategoryStories("duniya"),
    getWebStories(),
    getCategoryLead("manoranjan"),
    getCategoryStories("manoranjan"),
    getVideoStories(5),
    getBizGrid(),
    getGalleries(),
    getRashiSigns(),
  ]);

  const cricketStory =
    readable()
      .filter((s) => s.category.slug === "cricket" && s.type === "article")
      .sort(byNewest)[0] ?? null;

  return {
    hero,
    secondary,
    topNews,
    liveBlog,
    liveBreaking,
    mostRead,
    deshLead,
    deshList: deshPage.stories.filter((s) => s.id !== deshLead?.id).slice(0, 4),
    duniyaLead,
    duniyaList: duniyaPage.stories
      .filter((s) => s.id !== duniyaLead?.id)
      .slice(0, 4),
    webStories: webStoryList.slice(0, 7),
    cricketStory,
    entertainmentLead,
    entertainmentList: entertainmentPage.stories
      .filter((s) => s.id !== entertainmentLead?.id)
      .slice(0, 2),
    videoMain: videos[0] ?? null,
    videoList: videos.slice(1, 5),
    bizGrid,
    galleries: galleryList.slice(0, 5),
    rashiSigns: signs,
  };
}

// ──────────────────────────────────────────────────────────────────
// Static params for prerendering
// ──────────────────────────────────────────────────────────────────

export async function getStoryRouteParams(): Promise<
  { category: string; slug: string }[]
> {
  "use cache";
  cacheLife("hours");
  return readable().map((s) => ({
    category: s.category.slug,
    slug: `${s.slug}-${s.id}`,
  }));
}

/** The instant the reader site treats as "now" (see `lib/data/clock.ts`). */
export async function getNow(): Promise<string> {
  "use cache";
  cacheLife("minutes");
  return now().toISOString();
}
