/**
 * Hindi date & time formatting in IST (PRD §10.5).
 *
 * Month and weekday names are spelled out here rather than taken from `Intl`
 * so the output is identical on every runtime and matches the reference
 * screens exactly ("शुक्रवार, 20 नवंबर 2026").
 *
 * Every function takes the instant it should format — nothing reads the clock
 * implicitly, which keeps callers prerenderable (Cache Components forbids
 * `Date.now()` inside the static shell).
 */

const IST_OFFSET_MINUTES = 330; // UTC+05:30

export const HINDI_MONTHS = [
  "जनवरी",
  "फ़रवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
] as const;

export const HINDI_WEEKDAYS = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
] as const;

type DateInput = string | number | Date;

function toDate(input: DateInput): Date {
  return input instanceof Date ? input : new Date(input);
}

/** The same instant, shifted so UTC getters return IST calendar values. */
function istParts(input: DateInput) {
  const d = toDate(input);
  const shifted = new Date(d.getTime() + IST_OFFSET_MINUTES * 60_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
  };
}

/** "20 नवंबर 2026" */
export function hindiDate(input: DateInput): string {
  const { day, month, year } = istParts(input);
  return `${day} ${HINDI_MONTHS[month]} ${year}`;
}

/** "शुक्रवार, 20 नवंबर 2026" — used in the utility bar. */
export function hindiLongDate(input: DateInput): string {
  const { weekday } = istParts(input);
  return `${HINDI_WEEKDAYS[weekday]}, ${hindiDate(input)}`;
}

/** "20 नवंबर" — short dateline form on mobile. */
export function hindiDayMonth(input: DateInput): string {
  const { day, month } = istParts(input);
  return `${day} ${HINDI_MONTHS[month]}`;
}

/** "01:10 PM" in IST, Latin numerals (matches the reference byline). */
export function istClock(input: DateInput): string {
  const { hours, minutes } = istParts(input);
  const suffix = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** "13:58" — 24h clock used in the live-update timeline. */
export function istClock24(input: DateInput): string {
  const { hours, minutes } = istParts(input);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** "20 नवंबर 2026, 01:10 PM IST" */
export function hindiDateTime(input: DateInput): string {
  return `${hindiDate(input)}, ${istClock(input)} IST`;
}

/**
 * Relative time in Hindi — DESIGN.md §3 (TimeAgo).
 * "अभी" → "10 मिनट पहले" → "2 घंटे पहले" → "कल" → absolute date.
 * `now` is explicit so the result is deterministic and testable.
 */
export function hindiTimeAgo(input: DateInput, now: DateInput): string {
  const then = toDate(input).getTime();
  const current = toDate(now).getTime();
  const diffMinutes = Math.floor((current - then) / 60_000);

  if (diffMinutes < 1) return "अभी";
  if (diffMinutes < 60) return `${diffMinutes} मिनट पहले`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "1 घंटा पहले";
  if (diffHours < 24) return `${diffHours} घंटे पहले`;

  const dayDiff = istDayNumber(current) - istDayNumber(then);
  if (dayDiff <= 1) return "कल";
  return hindiDate(input);
}

/** Whole IST days since the epoch — used to tell "yesterday" from "2 days ago". */
function istDayNumber(ms: number): number {
  return Math.floor((ms + IST_OFFSET_MINUTES * 60_000) / 86_400_000);
}

/** True when the story was published within the given number of hours. */
export function isWithinHours(
  input: DateInput,
  hours: number,
  now: DateInput,
): boolean {
  return toDate(now).getTime() - toDate(input).getTime() <= hours * 3_600_000;
}

/** ISO 8601 with the IST offset — for `<time dateTime>` and JSON-LD. */
export function istIso(input: DateInput): string {
  const { year, month, day, hours, minutes } = istParts(input);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+05:30`;
}
