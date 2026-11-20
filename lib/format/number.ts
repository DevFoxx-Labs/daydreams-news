/**
 * Indian digit grouping (1,25,000) — PRD §10.5.
 * Numerals stay Latin, which is what Hindi news portals use for figures.
 */
export function indianNumber(value: number): string {
  const negative = value < 0;
  const [whole, fraction] = Math.abs(value).toString().split(".");
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest
    ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`
    : last3;
  const out = fraction ? `${grouped}.${fraction}` : grouped;
  return negative ? `-${out}` : out;
}

/** "₹76,250" */
export function rupees(value: number): string {
  return `₹${indianNumber(value)}`;
}

/** "▲ 0.74%" / "▼ 1.20%" with the direction glyph the market widget uses. */
export function signedPercent(value: number): string {
  const glyph = value >= 0 ? "▲" : "▼";
  return `${glyph} ${Math.abs(value).toFixed(2)}%`;
}
