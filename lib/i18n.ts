import messages from "@/messages/hi.json";

/**
 * All UI strings live in `messages/hi.json` (PRD §10.5) so an `en.json`
 * edition can be added later without touching components.
 */
export const t = messages;

/** Replace `{name}` placeholders: `fill(t.search.count, { n: 12 })`. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type Messages = typeof messages;
