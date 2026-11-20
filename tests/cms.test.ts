import { describe, expect, it } from "vitest";

import {
  getBreakingStories,
  getCategoryStories,
  getHomeData,
  getMostRead,
  getRelatedStories,
  getStateStories,
  getStory,
  getStoryRouteParams,
  getTicker,
  searchStories,
} from "@/lib/cms";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { stories } from "@/lib/data/stories";
import { parseStorySlug, shareUrl, storyHref } from "@/lib/routes";

describe("mock data set", () => {
  it("has at least 80 stories across categories and states (M3)", () => {
    expect(stories.length).toBeGreaterThanOrEqual(80);
    expect(new Set(stories.map((s) => s.category.slug)).size).toBeGreaterThan(5);
    expect(new Set(stories.map((s) => s.state).filter(Boolean)).size).toBeGreaterThan(
      8,
    );
  });

  it("gives every story a unique id and URL", () => {
    expect(new Set(stories.map((s) => s.id)).size).toBe(stories.length);
    expect(new Set(stories.map(storyHref)).size).toBe(stories.length);
  });

  it("builds story URLs as /<category>/<slug>-<id> (SEO-1)", () => {
    const story = stories.find((s) => s.type === "article")!;
    expect(storyHref(story)).toBe(
      `/${story.category.slug}/${story.slug}-${story.id}`,
    );
    expect(parseStorySlug(`${story.slug}-${story.id}`)).toEqual({
      slug: story.slug,
      id: story.id,
    });
  });
});

describe("ticker (FR-G2)", () => {
  it("drops expired items and caps the list at six", async () => {
    const items = await getTicker();
    expect(items.length).toBeLessThanOrEqual(6);
    expect(items.every((item) => Date.parse(item.expiresAt) > Date.parse(MOCK_NOW_ISO))).toBe(
      true,
    );
    expect(items.some((item) => item.id === "t0")).toBe(false);
  });
});

describe("most read (FR-H4)", () => {
  it("returns the six most-viewed stories of the last 24 hours", async () => {
    const list = await getMostRead(6);
    expect(list).toHaveLength(6);
    const views = list.map((story) => story.views ?? 0);
    expect([...views].sort((a, b) => b - a)).toEqual(views);
  });
});

describe("related stories (FR-A8)", () => {
  it("excludes the current story and prefers shared tags", async () => {
    const related = await getRelatedStories("1001", 3);
    expect(related).toHaveLength(3);
    expect(related.some((story) => story.id === "1001")).toBe(false);
    const source = await getStory("1001");
    const tags = new Set(source?.tags ?? []);
    expect(
      related[0].tags?.some((tag) => tags.has(tag)) ||
        related[0].category.slug === source?.category.slug,
    ).toBe(true);
  });
});

describe("category and state feeds", () => {
  it("paginates at 20 per page (FR-C2)", async () => {
    const page = await getCategoryStories("desh");
    expect(page.perPage).toBe(20);
    expect(page.stories.length).toBeLessThanOrEqual(20);
    expect(page.stories.every((story) => story.category.slug === "desh")).toBe(true);
  });

  it("filters by sub-category", async () => {
    const page = await getCategoryStories("desh", { sub: "krishi" });
    expect(page.stories.length).toBeGreaterThan(0);
    expect(
      page.stories.every((story) => story.subCategory?.slug === "krishi"),
    ).toBe(true);
  });

  it("returns a state feed for the home strip (FR-H3)", async () => {
    const feed = await getStateStories("uttar-pradesh", { count: 6 });
    expect(feed.stories.length).toBeGreaterThan(0);
    expect(feed.stories.every((story) => story.state === "uttar-pradesh")).toBe(true);
  });

  it("filters a city feed", async () => {
    const feed = await getStateStories("uttar-pradesh", { city: "lucknow" });
    expect(feed.stories.every((story) => story.city === "lucknow")).toBe(true);
  });
});

describe("search (FR-S1, FR-S2)", () => {
  it('finds "मौसम" when the query is "mausam"', async () => {
    const result = await searchStories({ q: "mausam" });
    expect(result.total).toBeGreaterThan(0);
    expect(
      result.stories.some(
        (story) =>
          story.title.includes("मौसम") ||
          (story.tags ?? []).includes("मौसम") ||
          story.subCategory?.name === "मौसम",
      ),
    ).toBe(true);
  });

  it("filters by category and date range", async () => {
    const result = await searchStories({
      q: "मौसम",
      category: "desh",
      range: "24h",
    });
    expect(result.stories.every((story) => story.category.slug === "desh")).toBe(
      true,
    );
  });

  it("returns nothing for an empty query", async () => {
    expect((await searchStories({ q: "   " })).total).toBe(0);
  });
});

describe("homepage composition (FR-H1, FR-H2)", () => {
  it("fills the curated slots without repeating a story", async () => {
    const home = await getHomeData();
    expect(home.hero.id).toBe("1001");
    expect(home.secondary).toHaveLength(2);
    expect(home.topNews).toHaveLength(5);

    const ids = [home.hero.id, ...home.secondary.map((s) => s.id), ...home.topNews.map((s) => s.id)];
    expect(new Set(ids).size).toBe(ids.length);
    expect(home.liveBlog?.updates.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps a breaking fallback for the live box", async () => {
    const breaking = await getBreakingStories(4);
    expect(breaking.length).toBeGreaterThan(0);
    expect(breaking.every((story) => story.isBreaking)).toBe(true);
  });
});

describe("prerender params", () => {
  it("lists every readable story for generateStaticParams", async () => {
    const params = await getStoryRouteParams();
    expect(params.length).toBeGreaterThanOrEqual(80);
    expect(params[0]).toHaveProperty("category");
    expect(params[0].slug).toMatch(/-\d+$/);
  });
});

describe("share URLs (FR-A6)", () => {
  it("adds UTM parameters", () => {
    const url = shareUrl("https://example.com/desh/x-1", "whatsapp");
    expect(url).toContain("utm_source=whatsapp");
    expect(url).toContain("utm_medium=social");
  });

  it("accepts a relative path during server render", () => {
    expect(shareUrl("/desh/x-1", "copy")).toContain("utm_source=copy");
  });
});
