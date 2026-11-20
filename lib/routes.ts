import type { Gallery, Story, WebStory } from "./data/types";

/**
 * URL builders — SEO-1: clean, stable URLs `/<category>/<slug>-<id>`.
 * Pure and synchronous so Client Components can use them too.
 */

export function storyHref(story: Story): string {
  if (story.type === "video") return `/videos/${story.slug}-${story.id}`;
  if (story.type === "gallery") return `/photos/${story.slug}`;
  if (story.type === "webstory") return `/web-stories/${story.slug}`;
  return `/${story.category.slug}/${story.slug}-${story.id}`;
}

export function categoryHref(slug: string): string {
  return `/${slug}`;
}

export function subCategoryHref(parentSlug: string, subSlug: string): string {
  return `/${parentSlug}?sub=${subSlug}`;
}

export function stateHref(stateSlug: string, citySlug?: string): string {
  return citySlug ? `/state/${stateSlug}/${citySlug}` : `/state/${stateSlug}`;
}

export function authorHref(slug: string): string {
  return `/author/${slug}`;
}

export function tagHref(slug: string): string {
  return `/tag/${slug}`;
}

export function liveHref(slug: string): string {
  return `/live/${slug}`;
}

export function webStoryHref(story: WebStory): string {
  return `/web-stories/${story.slug}`;
}

export function galleryHref(gallery: Gallery): string {
  return `/photos/${gallery.slug}`;
}

export function rashiHref(slug: string): string {
  return `/rashifal/${slug}`;
}

export function searchHref(query: string): string {
  return `/search?q=${encodeURIComponent(query)}`;
}

/** Splits `uttar-bharat-kohra-alert-1001` into its slug and id parts. */
export function parseStorySlug(param: string): { slug: string; id: string } | null {
  const match = /^(.*)-(\d+)$/.exec(param);
  if (!match) return null;
  return { slug: match[1], id: match[2] };
}

/**
 * FR-A6 — social shares carry UTM parameters.
 * Accepts a relative path too: on the server there is no `location`, so the
 * share bar renders with the path until it hydrates.
 */
export function shareUrl(pathOrUrl: string, network: string): string {
  const url = new URL(pathOrUrl, "https://share.local");
  url.searchParams.set("utm_source", network);
  url.searchParams.set("utm_medium", "social");
  return url.toString();
}
