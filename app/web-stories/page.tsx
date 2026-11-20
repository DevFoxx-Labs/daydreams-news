import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { StoryImage } from "@/components/news/story-image";
import { getWebStories } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { webStoryHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** Web stories listing — FR-W3. */

export const metadata: Metadata = {
  title: t.common.webStories,
  description: `तस्वीरों और छोटे टेक्स्ट में ख़बरें — ${site.name} वेब स्टोरीज़।`,
  alternates: { canonical: "/web-stories" },
};

export default async function WebStoriesPage() {
  const stories = await getWebStories();

  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <SectionHeader title={t.common.webStories} as="h1" />
        <ul className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 lg:grid-cols-5">
          {stories.map((story) => (
            <li key={story.slug}>
              <Link href={webStoryHref(story)} className="group block">
                <StoryImage
                  media={story.cover}
                  seed={`wsl-${story.slug}`}
                  rounded="rounded-[10px]"
                  className="aspect-[9/16]"
                  sizes="(max-width: 639px) 50vw, 240px"
                >
                  <span className="absolute inset-x-0 bottom-0 z-2 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3.5 pt-12 text-[15px] font-bold leading-[1.3] text-white">
                    <span className="clamp-3 block">{story.title}</span>
                  </span>
                </StoryImage>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </SiteShell>
  );
}
