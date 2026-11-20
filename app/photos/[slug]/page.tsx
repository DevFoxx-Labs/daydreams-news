import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { CategoryLabel, Container, TimeAgo } from "@/components/news/primitives";
import { GalleryViewer } from "@/components/stories/gallery-viewer";
import { getGalleries, getGallery } from "@/lib/cms";
import { t } from "@/lib/i18n";
import { galleryHref } from "@/lib/routes";

/** Photo gallery page — DESIGN.md §7, FR-P1. */

export async function generateStaticParams() {
  const galleries = await getGalleries();
  return galleries.map((gallery) => ({ slug: gallery.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/photos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGallery(slug);
  if (!gallery) return { title: t.pages.notFoundTitle };
  return {
    title: gallery.title,
    description: gallery.images[0]?.caption,
    alternates: { canonical: galleryHref(gallery) },
  };
}

export default async function GalleryPage({
  params,
}: PageProps<"/photos/[slug]">) {
  const { slug } = await params;
  const gallery = await getGallery(slug);
  if (!gallery) notFound();

  return (
    <SiteShell variant="reading">
      <Container className="max-w-[900px] pb-10 pt-5">
        <CategoryLabel name={gallery.category.name} slug={gallery.category.slug} />
        <h1 className="t-h-lg mb-1">{gallery.title}</h1>
        <TimeAgo value={gallery.publishedAt} className="mb-4 block" />
        <GalleryViewer images={gallery.images} />
      </Container>
    </SiteShell>
  );
}
