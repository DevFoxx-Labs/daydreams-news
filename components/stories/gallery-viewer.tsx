"use client";

import { useCallback, useEffect } from "react";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  HugeiconsIcon,
} from "@/components/icons";
import { AdSlot } from "@/components/news/ad-slot";
import { StoryImage } from "@/components/news/story-image";
import { createClientStore, useClientStore } from "@/lib/client-store";
import type { Media } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Photo gallery viewer — FR-P1.
 * One image at a time, caption and credit, "3/12" counter, thumbnail strip,
 * keyboard and swipe navigation, an ad after every four images, and the URL
 * hash follows the current image (for analytics).
 */
/**
 * The URL hash is the single source of truth for the current image: it keeps
 * the analytics requirement (each view updates the URL) and survives a
 * refresh or a shared link without any state syncing.
 */
const hashStore = createClientStore(() => location.hash, "");

export function GalleryViewer({ images }: { images: Media[] }) {
  const total = images.length;
  const hash = useClientStore(hashStore);
  const fromHash = Number.parseInt(hash.replace("#", ""), 10);
  const index =
    Number.isFinite(fromHash) && fromHash >= 1 && fromHash <= total
      ? fromHash - 1
      : 0;
  const image = images[index];

  const go = useCallback(
    (next: number) => {
      const clamped = Math.min(total - 1, Math.max(0, next));
      history.replaceState(null, "", `#${clamped + 1}`);
      hashStore.refresh();
    },
    [total],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const showAd = index > 0 && (index + 1) % 4 === 0;

  return (
    <div>
      <div className="relative">
        <StoryImage
          media={image}
          seed={`gal-view-${index}`}
          priority={index === 0}
          rounded="rounded-[6px]"
          className="aspect-[16/10]"
          sizes="(max-width: 1023px) 100vw, 880px"
        />
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label={t.common.previous}
          className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white disabled:opacity-30"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === total - 1}
          aria-label={t.common.next}
          className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white disabled:opacity-30"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={22} strokeWidth={2} />
        </button>
        <span className="absolute right-3 top-3 rounded-[12px] bg-black/70 px-2.5 py-1 font-ui text-[13px] font-semibold text-white">
          {index + 1}/{total}
        </span>
      </div>

      <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-2">
        {image.caption}
        {image.isFile ? ` ${t.common.symbolicImage}` : ""}
        {image.credit ? (
          <span className="text-meta"> — {image.credit}</span>
        ) : null}
      </p>

      {showAd ? (
        <AdSlot size="300x250" placement={`gallery-${index}`} className="my-5" />
      ) : null}

      <ul className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">
        {images.map((thumb, thumbIndex) => (
          <li key={thumbIndex} className="shrink-0">
            <button
              type="button"
              onClick={() => go(thumbIndex)}
              aria-label={`${thumbIndex + 1}/${total}`}
              aria-current={thumbIndex === index ? "true" : undefined}
              className={cn(
                "block w-[88px] overflow-hidden rounded-[4px] border-2",
                thumbIndex === index ? "border-brand" : "border-transparent",
              )}
            >
              <StoryImage
                media={thumb}
                seed={`gal-thumb-${thumbIndex}`}
                rounded="rounded-[2px]"
                className="aspect-[4/3]"
                sizes="88px"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
