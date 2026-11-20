import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/layout/site-shell";
import { Container, TimeAgo } from "@/components/news/primitives";
import { SectionHeader } from "@/components/news/section-header";
import { PhotoCount, StoryImage } from "@/components/news/story-image";
import { getGalleries } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { galleryHref } from "@/lib/routes";
import { site } from "@/lib/site";

/** Photo galleries listing. */

export const metadata: Metadata = {
  title: t.home.photoGallery,
  description: `तस्वीरों में ख़बरें — ${site.name} फ़ोटो गैलरी।`,
  alternates: { canonical: "/photos" },
};

export default async function PhotosPage() {
  const galleries = await getGalleries();

  return (
    <SiteShell variant="full">
      <Container className="pt-5">
        <SectionHeader title={t.home.photoGallery} as="h1" />
        <ul className="grid grid-cols-1 gap-6 pb-10 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <li key={gallery.slug}>
              <Link href={galleryHref(gallery)} className="group block">
                <StoryImage
                  media={gallery.images[0]}
                  seed={`gl-${gallery.slug}`}
                  className="mb-2.5 aspect-[16/10]"
                  sizes="(max-width: 639px) 100vw, 400px"
                >
                  <PhotoCount count={gallery.images.length} />
                </StoryImage>
                <span className="t-category mb-1 block">
                  {gallery.category.name}
                </span>
                <h2 className="t-h-md clamp-2 group-hover:text-brand-dark">
                  {gallery.title}
                </h2>
                <TimeAgo value={gallery.publishedAt} className="mt-1 block" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </SiteShell>
  );
}
