"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ArrowUp01Icon,
  Cancel01Icon,
  HugeiconsIcon,
} from "@/components/icons";
import { LogoMark } from "@/components/layout/logo";
import { SceneArt } from "@/components/news/scene-art";
import type { WebStory } from "@/lib/data/types";
import { t } from "@/lib/i18n";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Web story player — DESIGN.md §7, FR-W1.
 *
 * Tap left/right to move, hold to pause, auto-advance every 6s, swipe down to
 * close, segmented progress bars. Keyboard: ←/→/Escape. Auto-advance is
 * disabled when the reader prefers reduced motion.
 */

const SLIDE_MS = 6000;
const TICK_MS = 50;

export function WebStoryPlayer({
  story,
  articleHref,
}: {
  story: WebStory;
  articleHref: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const total = story.slides.length;
  const slide = story.slides[index];

  const next = useCallback(() => {
    setElapsed(0);
    setIndex((current) => Math.min(total - 1, current + 1));
  }, [total]);

  const previous = useCallback(() => {
    setElapsed(0);
    setIndex((current) => Math.max(0, current - 1));
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const timer = setInterval(() => {
      setElapsed((value) => {
        if (value + TICK_MS >= SLIDE_MS) {
          if (index < total - 1) {
            setIndex((current) => current + 1);
            return 0;
          }
          return SLIDE_MS;
        }
        return value + TICK_MS;
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [index, paused, total]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "Escape") history.back();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, previous]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div
        className="relative h-dvh w-full overflow-hidden bg-ink lg:aspect-[9/16] lg:h-[min(90dvh,840px)] lg:w-auto lg:rounded-[12px]"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
            history.back();
          }
        }}
      >
        <SceneArt
          scene={slide.image.scene ?? "city"}
          seed={`slide-${story.slug}-${index}`}
          className="absolute inset-0 size-full object-cover"
        />
        <span className="sr-only">{slide.image.alt}</span>

        {/* Progress bars */}
        <div className="absolute inset-x-3.5 top-[58px] z-3 flex gap-1" aria-hidden="true">
          {story.slides.map((_, slideIndex) => (
            <i key={slideIndex} className="h-[3px] flex-1 rounded-[2px] bg-white/45">
              <i
                className="block h-full rounded-[2px] bg-white"
                style={{
                  width:
                    slideIndex < index
                      ? "100%"
                      : slideIndex === index
                        ? `${(elapsed / SLIDE_MS) * 100}%`
                        : "0%",
                }}
              />
            </i>
          ))}
        </div>

        {/* Header */}
        <div className="absolute inset-x-3.5 top-[72px] z-3 flex items-center justify-between text-[14px] font-bold text-white">
          <span className="flex items-center gap-2">
            <LogoMark className="size-7 p-0.5" asLink={false} />
            <span>
              {site.name} · {t.common.webStories}
            </span>
          </span>
          <Link href={articleHref ?? "/web-stories"} aria-label={t.common.close}>
            <HugeiconsIcon icon={Cancel01Icon} size={22} strokeWidth={2} />
          </Link>
        </div>

        {/* Tap zones */}
        <button
          type="button"
          onClick={previous}
          aria-label={t.common.previous}
          className="absolute inset-y-0 left-0 z-2 w-1/3"
        />
        <button
          type="button"
          onClick={next}
          aria-label={t.common.next}
          className="absolute inset-y-0 right-0 z-2 w-2/3"
        />

        {/* Caption */}
        <div className="absolute inset-x-0 bottom-0 z-3 bg-[linear-gradient(transparent,rgba(0,0,0,0.92)_45%)] px-5 pb-10 pt-40 text-white">
          <span className="mb-3 inline-block bg-brand px-3 py-1 font-ui text-[15px] font-extrabold">
            {index + 1} / {total}
          </span>
          <h1 className="mb-2.5 text-[26px] font-extrabold leading-[1.25] lg:text-[30px]">
            {slide.title}
          </h1>
          {slide.text ? (
            <p className="text-[16px] leading-[1.55] text-[#e5e5e5]">{slide.text}</p>
          ) : null}

          {index === total - 1 && articleHref ? (
            <Link
              href={articleHref}
              className={cn(
                "mt-5 flex flex-col items-center text-[14px] font-semibold text-white",
              )}
            >
              <HugeiconsIcon icon={ArrowUp01Icon} size={22} strokeWidth={2} />
              पूरी ख़बर पढ़ें
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
