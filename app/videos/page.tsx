import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Container, TimeAgo } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { Duration, PlayBadge, StoryImage } from "@/components/news/story-image";
import { getVideoStories } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { storyHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** Video listing — DESIGN.md §7, FR-V1. */

export const metadata: Metadata = {
  title: "वीडियो",
  description: `ख़बरों के वीडियो, शॉर्ट्स और इंटरव्यू — ${site.name} पर।`,
  alternates: { canonical: "/videos" },
};

export default async function VideosPage() {
  const videos = await getVideoStories(24);

  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <SectionHeader title={t.common.video} as="h1" />
        <ul className="grid grid-cols-1 gap-6 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((story) => (
            <li key={story.id}>
              <Link href={storyHref(story)} className="group block">
                <StoryImage
                  media={story.image}
                  seed={`vid-${story.id}`}
                  className="mb-2.5 aspect-video"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"
                >
                  <PlayBadge />
                  {story.videoDuration ? (
                    <Duration value={story.videoDuration} />
                  ) : null}
                </StoryImage>
                <span className="t-category mb-1 block">
                  {story.subCategory?.name ?? story.category.name}
                </span>
                <h2 className="t-h-md clamp-2 group-hover:text-brand-dark">
                  {story.title}
                </h2>
                <TimeAgo value={story.publishedAt} className="mt-1 block" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </SiteShell>
  );
}
