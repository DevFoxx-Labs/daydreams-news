"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LiveBadge } from "@/components/news/primitives";
import { fill, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Live blog timeline — FR-L1 / FR-L2.
 *
 * Polls every 45s (within the 30–60s window) while the blog is live and the
 * tab is visible. New posts are held back behind a "नए अपडेट (n)" pill once
 * the reader has scrolled away from the top, so the page never jumps under
 * them.
 */

export type TimelineUpdate = {
  id: string;
  time: string;
  clock: string;
  title: string;
  isPinned: boolean;
  body?: string[];
};

const POLL_MS = 45_000;

export function LiveTimeline({
  blogId,
  initialUpdates,
  status,
}: {
  blogId: string;
  initialUpdates: TimelineUpdate[];
  status: "live" | "ended";
}) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [pending, setPending] = useState<TimelineUpdate[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const latestTime = useRef(initialUpdates[0]?.time ?? new Date(0).toISOString());

  const poll = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/live/${encodeURIComponent(blogId)}/updates?since=${encodeURIComponent(latestTime.current)}`,
      );
      if (!response.ok) return;
      const payload = (await response.json()) as { updates: TimelineUpdate[] };
      if (payload.updates.length === 0) return;

      latestTime.current = payload.updates[0].time;
      if (window.scrollY < 200) {
        setUpdates((current) => [...payload.updates, ...current]);
      } else {
        setPending((current) => [...payload.updates, ...current]);
      }
    } catch {
      // Offline or rate-limited: try again on the next tick.
    }
  }, [blogId]);

  useEffect(() => {
    if (status !== "live" || !autoRefresh) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void poll();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [autoRefresh, poll, status]);

  function showPending() {
    setUpdates((current) => [...pending, ...current]);
    setPending([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
        <span className="flex items-center gap-2">
          {status === "live" ? (
            <LiveBadge />
          ) : (
            <span className="rounded-[3px] bg-ink px-2 py-[3px] font-ui text-[12px] font-bold text-white">
              {t.live.ended}
            </span>
          )}
          <span className="text-[13.5px] text-meta">
            {t.live.lastUpdated}: {updates[0]?.clock ?? "—"}
          </span>
        </span>
        {status === "live" ? (
          <label className="flex cursor-pointer items-center gap-2 text-[13.5px] font-semibold text-ink-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
              className="size-4 accent-[#C8102E]"
            />
            {t.live.autoRefresh}
          </label>
        ) : null}
      </div>

      {pending.length > 0 ? (
        <button
          type="button"
          onClick={showPending}
          className="sticky top-16 z-20 mx-auto mb-4 block rounded-[20px] bg-brand px-4 py-2 text-[14px] font-bold text-white shadow-lg"
        >
          {fill(t.live.newUpdates, { n: pending.length })}
        </button>
      ) : null}

      <ol className="relative border-s border-line ps-5">
        {updates.map((update) => (
          <li key={update.id} className="relative pb-6">
            <span
              className="absolute -start-[25px] top-[7px] size-[9px] rounded-full bg-brand"
              aria-hidden="true"
            />
            <span className="font-ui text-[13px] font-bold text-brand">
              {update.clock}
            </span>
            {update.isPinned ? (
              <span className="ms-2 rounded-[3px] bg-brand-tint px-1.5 py-[1px] text-[11px] font-bold text-brand">
                पिन
              </span>
            ) : null}
            <h3
              className={cn(
                "mt-1 text-[17px] font-bold leading-snug lg:text-[19px]",
              )}
            >
              {update.title}
            </h3>
            {update.body?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-2 text-[16px] leading-[1.75] text-ink-2 lg:text-[17px]"
              >
                {paragraph}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
