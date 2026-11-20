import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/** robots.txt — SEO-6. Search results and previews stay out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/search", "/consent", "/preview/"],
      },
    ],
    sitemap: [
      `${site.url}/sitemap.xml`,
      `${site.url}/news-sitemap.xml`,
    ],
    host: site.url,
  };
}
