import type { LiveBlog, Story } from "@/lib/data/types";
import { istIso } from "@/lib/format/hindiDate";
import { authorHref, storyHref } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Structured data — SEO-3.
 * `NewsArticle`, `BreadcrumbList`, `Organization`, `WebSite` + SearchAction,
 * `LiveBlogPosting` and `VideoObject`.
 */

const abs = (path: string) => new URL(path, site.url).toString();

/** Site-wide social card (same file as app/opengraph-image.png, stable URL). */
const SITE_CARD = "/brand/social/og-default-1200x630.png";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: site.name,
    alternateName: site.nameLatin !== site.name ? site.nameLatin : undefined,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: abs(site.brand.organizationLogo.src),
      width: site.brand.organizationLogo.width,
      height: site.brand.organizationLogo.height,
    },
    inLanguage: site.lang,
    ethicsPolicy: abs("/ethics"),
    correctionsPolicy: abs("/ethics"),
    publishingPrinciples: abs("/about"),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: site.lang,
    publisher: organizationJsonLd(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: abs("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function newsArticleJsonLd(story: Story) {
  return {
    "@context": "https://schema.org",
    "@type": story.type === "video" ? "VideoObject" : "NewsArticle",
    headline: story.title.slice(0, 110),
    description: story.deck,
    inLanguage: site.lang,
    mainEntityOfPage: abs(storyHref(story)),
    url: abs(storyHref(story)),
    datePublished: istIso(story.publishedAt),
    dateModified: istIso(story.updatedAt ?? story.publishedAt),
    articleSection: story.category.name,
    keywords: story.tags?.join(", "),
    // Until per-story cards exist (docs/known-gaps.md), the site card is used.
    image: [abs(SITE_CARD)],
    thumbnailUrl: abs(SITE_CARD),
    uploadDate: story.type === "video" ? istIso(story.publishedAt) : undefined,
    duration: story.videoDuration
      ? `PT${story.videoDuration.split(":")[0]}M${story.videoDuration.split(":")[1]}S`
      : undefined,
    author: story.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      url: abs(authorHref(author.slug)),
    })),
    publisher: organizationJsonLd(),
    isAccessibleForFree: true,
    ...(story.isSponsored ? { sponsor: { "@type": "Organization", name: "विज्ञापनदाता" } } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

export function liveBlogJsonLd(blog: LiveBlog) {
  return {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    headline: blog.title.slice(0, 110),
    description: blog.summary,
    inLanguage: site.lang,
    url: abs(`/live/${blog.slug}`),
    coverageStartTime: istIso(blog.startedAt),
    ...(blog.status === "ended"
      ? { coverageEndTime: istIso(blog.updatedAt) }
      : {}),
    datePublished: istIso(blog.startedAt),
    dateModified: istIso(blog.updatedAt),
    publisher: organizationJsonLd(),
    liveBlogUpdate: blog.updates.map((update) => ({
      "@type": "BlogPosting",
      headline: update.title.slice(0, 110),
      datePublished: istIso(update.time),
    })),
  };
}
