import Image from "next/image";
import type * as React from "react";

import { HugeiconsIcon, Image01Icon, PlayIcon } from "@/components/icons";
import { SceneArt } from "@/components/news/scene-art";
import { LiveBadge } from "@/components/news/primitives";
import type { Media } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/**
 * StoryImage — DESIGN.md §3.
 *
 * Renders `next/image` when the CMS gave us a real photo and the illustrated
 * demo scene otherwise. The box always has a fixed aspect ratio or height, so
 * no image can shift the layout (CLS < 0.1).
 */
export function StoryImage({
  media,
  /** Tailwind aspect/height classes — the caller owns the box size. */
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
  seed,
  rounded = "rounded-[5px]",
  children,
}: {
  media: Media;
  className?: string;
  sizes?: string;
  priority?: boolean;
  seed: string;
  rounded?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-soft",
        rounded,
        className,
      )}
    >
      {media.url ? (
        <Image
          src={media.url}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
        />
      ) : (
        <>
          <SceneArt
            scene={media.scene ?? "city"}
            seed={seed}
            className="absolute inset-0 size-full"
          />
          {/* The illustration is decorative; the story text carries the meaning. */}
          <span className="sr-only">{media.alt}</span>
        </>
      )}
      {children}
    </div>
  );
}

/** 34px black circle with ▶, bottom-left — video cards. */
export function PlayBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-2.5 left-2.5 z-2 grid size-[34px] place-items-center rounded-full bg-black/65 text-white",
        className,
      )}
      aria-hidden="true"
    >
      <HugeiconsIcon icon={PlayIcon} size={14} strokeWidth={2} className="translate-x-[1px]" />
    </span>
  );
}

/** Big centred play button on the main video tile. */
export function PlayBadgeLarge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute left-1/2 top-1/2 z-2 grid size-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand/92 text-white",
        className,
      )}
      aria-hidden="true"
    >
      <HugeiconsIcon icon={PlayIcon} size={30} strokeWidth={2} className="translate-x-[2px]" />
    </span>
  );
}

/** Duration pill, bottom-right, Inter 11px. */
export function Duration({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-1.5 right-1.5 z-2 rounded-[3px] bg-black/75 px-1.5 py-[2px] font-ui text-[11px] font-semibold text-white",
        className,
      )}
    >
      {value}
    </span>
  );
}

/** Photo-count pill, top-right. */
export function PhotoCount({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "absolute right-2.5 top-2.5 z-2 inline-flex items-center gap-1 rounded-[12px] bg-black/70 px-2 py-[3px] font-ui text-[12px] font-semibold text-white",
        className,
      )}
    >
      <HugeiconsIcon icon={Image01Icon} size={12} strokeWidth={2} aria-hidden="true" />
      {count}
    </span>
  );
}

/** LIVE badge positioned over an image. */
export function ImageLiveBadge({ className }: { className?: string }) {
  return <LiveBadge className={cn("absolute left-3 top-3 z-2", className)} />;
}
