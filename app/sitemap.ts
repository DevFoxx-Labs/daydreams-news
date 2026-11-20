import type { MetadataRoute } from "next";

import {
  getAllCategories,
  getAuthors,
  getGalleries,
  getLatest,
  getStates,
  getWebStories,
} from "@/lib/cms";
import { stories } from "@/lib/data/stories";
import {
  authorHref,
  categoryHref,
  galleryHref,
  stateHref,
  storyHref,
  webStoryHref,
} from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * XML sitemap — SEO-4.
 *
 * One file is enough at this size. When the archive grows past ~10k URLs it
 * splits into per-month article sitemaps behind `generateSitemaps()`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, states, authors, webStories, galleries, latest] =
    await Promise.all([
      getAllCategories(),
      getStates(),
      getAuthors(),
      getWebStories(),
      getGalleries(),
      getLatest(1),
    ]);

  const abs = (path: string) => new URL(path, site.url).toString();
  const homeUpdated = latest[0]?.publishedAt ?? new Date().toISOString();

  return [
    { url: abs("/"), lastModified: homeUpdated, changeFrequency: "hourly", priority: 1 },
    ...["/videos", "/web-stories", "/photos", "/rashifal", "/state", "/newsletter", "/sitemap"].map(
      (path) => ({
        url: abs(path),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }),
    ),
    ...["/about", "/contact", "/advertise", "/privacy", "/terms", "/cookies", "/ethics", "/grievance"].map(
      (path) => ({
        url: abs(path),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      }),
    ),
    ...categories.map((category) => ({
      url: abs(categoryHref(category.slug)),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...states.flatMap((state) => [
      {
        url: abs(stateHref(state.slug)),
        changeFrequency: "hourly" as const,
        priority: 0.7,
      },
      ...state.cities.map((city) => ({
        url: abs(stateHref(state.slug, city.slug)),
        changeFrequency: "daily" as const,
        priority: 0.6,
      })),
    ]),
    ...authors.map((author) => ({
      url: abs(authorHref(author.slug)),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...stories
      .filter((story) => !story.noindex)
      .map((story) => ({
        url: abs(storyHref(story)),
        lastModified: story.updatedAt ?? story.publishedAt,
        changeFrequency: "daily" as const,
        priority: 0.9,
      })),
    ...webStories.map((story) => ({
      url: abs(webStoryHref(story)),
      lastModified: story.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...galleries.map((gallery) => ({
      url: abs(galleryHref(gallery)),
      lastModified: gallery.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
