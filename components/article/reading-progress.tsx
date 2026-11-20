"use client";

import { useEffect, useState } from "react";

import { t } from "@/lib/i18n";

/**
 * Reading progress bar — DESIGN.md §6 (4px gold, sticky under the nav).
 * Uses `requestAnimationFrame` so scrolling never blocks the main thread.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, value)));
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="sticky top-0 z-20 h-1 bg-[#f0f0f0]"
      role="progressbar"
      aria-label={t.article.readingProgress}
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gold transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
