/**
 * The demo clock.
 *
 * Every mock timestamp is derived from this one instant, and every relative
 * time ("2 घंटे पहले") is measured against it. Two reasons:
 *
 * 1. Cache Components fails the prerender on `Date.now()` in the static
 *    shell, and a news front page is almost entirely static shell.
 * 2. It keeps the rendered output byte-identical between runs, so the
 *    screenshot comparison against `docs/reference/*.png` is meaningful.
 *
 * When the CMS is connected, `now()` becomes the real clock and the affected
 * widgets move behind `<Suspense>` with `connection()`.
 */
export const MOCK_NOW_ISO = "2026-11-20T13:10:00+05:30";

export const MOCK_NOW_MS = Date.parse(MOCK_NOW_ISO);

/** The instant the reader site treats as "now". */
export function now(): Date {
  return new Date(MOCK_NOW_MS);
}

/** An ISO timestamp `minutes` before the demo clock. */
export function minutesAgo(minutes: number): string {
  return new Date(MOCK_NOW_MS - minutes * 60_000).toISOString();
}

/** An ISO timestamp `minutes` after the demo clock. */
export function minutesAhead(minutes: number): string {
  return new Date(MOCK_NOW_MS + minutes * 60_000).toISOString();
}
