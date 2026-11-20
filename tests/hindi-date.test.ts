import { describe, expect, it } from "vitest";

import {
  hindiDate,
  hindiDateTime,
  hindiLongDate,
  hindiTimeAgo,
  istClock24,
  istIso,
} from "@/lib/format/hindiDate";
import { indianNumber, rupees, signedPercent } from "@/lib/format/number";

const NOW = "2026-11-20T13:10:00+05:30";

describe("Hindi dates in IST", () => {
  it("formats the utility-bar date", () => {
    expect(hindiLongDate(NOW)).toBe("शुक्रवार, 20 नवंबर 2026");
  });

  it("formats a dateline", () => {
    expect(hindiDate(NOW)).toBe("20 नवंबर 2026");
    expect(hindiDateTime(NOW)).toBe("20 नवंबर 2026, 01:10 PM IST");
  });

  it("converts UTC input to IST", () => {
    // 19:40 UTC is 01:10 IST the next day.
    expect(istClock24("2026-11-20T19:40:00Z")).toBe("01:10");
    expect(hindiDate("2026-11-20T19:40:00Z")).toBe("21 नवंबर 2026");
  });

  it("emits an ISO string with the IST offset for <time> and JSON-LD", () => {
    expect(istIso(NOW)).toBe("2026-11-20T13:10:00+05:30");
  });
});

describe("hindiTimeAgo", () => {
  const ago = (minutes: number) =>
    new Date(Date.parse(NOW) - minutes * 60_000).toISOString();

  it("walks through the Hindi relative-time steps", () => {
    expect(hindiTimeAgo(ago(0), NOW)).toBe("अभी");
    expect(hindiTimeAgo(ago(10), NOW)).toBe("10 मिनट पहले");
    expect(hindiTimeAgo(ago(60), NOW)).toBe("1 घंटा पहले");
    expect(hindiTimeAgo(ago(125), NOW)).toBe("2 घंटे पहले");
    expect(hindiTimeAgo(ago(60 * 30), NOW)).toBe("कल");
    expect(hindiTimeAgo(ago(60 * 24 * 5), NOW)).toBe("15 नवंबर 2026");
  });
});

describe("Indian number formatting", () => {
  it("groups by lakh and crore", () => {
    expect(indianNumber(125000)).toBe("1,25,000");
    expect(indianNumber(80412)).toBe("80,412");
    expect(rupees(76250)).toBe("₹76,250");
  });

  it("marks market direction", () => {
    expect(signedPercent(0.74)).toBe("▲ 0.74%");
    expect(signedPercent(-1.2)).toBe("▼ 1.20%");
  });
});
