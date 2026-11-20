"use client";

import { useState } from "react";

import { HugeiconsIcon, PlayIcon } from "@/components/icons";

/**
 * Click-to-load embed facade — FR-A2, web-performance rule.
 *
 * Nothing from YouTube/X/Instagram/Facebook is requested until the reader
 * clicks: no script, no cookie, no iframe. The box reserves a 16:9 slot, so
 * loading the real embed cannot shift the page.
 */

const PROVIDERS = {
  youtube: {
    label: "YouTube वीडियो",
    src: (id: string) =>
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`,
  },
  x: {
    label: "X पोस्ट",
    src: (id: string) => `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(id)}`,
  },
  instagram: {
    label: "Instagram पोस्ट",
    src: (id: string) => `https://www.instagram.com/p/${encodeURIComponent(id)}/embed`,
  },
  facebook: {
    label: "Facebook पोस्ट",
    src: (id: string) =>
      `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(id)}`,
  },
} as const;

export function EmbedFacade({
  provider,
  id,
  title,
}: {
  provider: keyof typeof PROVIDERS;
  id: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const config = PROVIDERS[provider];

  return (
    <figure className="my-5">
      <div className="relative aspect-video w-full overflow-hidden rounded-[6px] bg-soft">
        {loaded ? (
          <iframe
            src={config.src(id)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 flex size-full flex-col items-center justify-center gap-2 text-ink-2"
          >
            <span className="grid size-16 place-items-center rounded-full bg-brand text-white">
              <HugeiconsIcon icon={PlayIcon} size={26} strokeWidth={2} />
            </span>
            <span className="px-4 text-center text-[15px] font-semibold">
              {title}
            </span>
            <span className="text-[13px] text-muted">
              {config.label} लोड करने के लिए टैप करें
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-[13px] text-muted">
        {config.label} · क्लिक करने पर ही बाहरी सामग्री लोड होगी।
      </figcaption>
    </figure>
  );
}
