import { describe, expect, it } from "vitest";

import { validateConsentInput } from "@/lib/consent/ledger.server";
import {
  CONSENT_PURPOSES,
  DEFAULT_CONSENT,
  OPTIONAL_PURPOSES,
} from "@/lib/consent/types";
import { NOTICE_VERSION_STRING, legalNotices } from "@/lib/legal/notices";
import { clientIp, rateLimit, resetRateLimits } from "@/lib/rate-limit";

const validVisitor = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

describe("consent defaults (DPDP s.6)", () => {
  it("has every optional purpose off by default", () => {
    expect(DEFAULT_CONSENT.necessary).toBe(true);
    for (const purpose of OPTIONAL_PURPOSES) {
      expect(DEFAULT_CONSENT[purpose]).toBe(false);
    }
  });

  it("keeps the newsletter as its own purpose, outside the cookie categories", () => {
    expect(CONSENT_PURPOSES).toContain("newsletter");
    expect(OPTIONAL_PURPOSES).not.toContain("newsletter");
  });
});

describe("consent ledger validation (abuse cases)", () => {
  const valid = {
    visitorId: validVisitor,
    method: "cookie_banner",
    noticeVersion: NOTICE_VERSION_STRING,
    purposes: [
      { purpose: "analytics", status: "granted" },
      { purpose: "ads", status: "denied" },
    ],
  };

  it("accepts a well-formed payload", () => {
    const parsed = validateConsentInput(valid);
    expect(parsed).not.toBeNull();
    expect(parsed?.purposes).toHaveLength(2);
    // The client can never set these — the route fills them from the request.
    expect(parsed?.ipAddress).toBeNull();
    expect(parsed?.userId).toBeNull();
  });

  it("rejects an unknown purpose", () => {
    expect(
      validateConsentInput({
        ...valid,
        purposes: [{ purpose: "tracking-everything", status: "granted" }],
      }),
    ).toBeNull();
  });

  it("rejects an unknown status", () => {
    expect(
      validateConsentInput({
        ...valid,
        purposes: [{ purpose: "ads", status: "maybe" }],
      }),
    ).toBeNull();
  });

  it("rejects an unknown method", () => {
    expect(validateConsentInput({ ...valid, method: "admin_override" })).toBeNull();
  });

  it("rejects a forged visitor id", () => {
    expect(validateConsentInput({ ...valid, visitorId: "../../etc/passwd" })).toBeNull();
    expect(validateConsentInput({ ...valid, visitorId: "short" })).toBeNull();
  });

  it("rejects a junk notice version and empty payloads", () => {
    expect(validateConsentInput({ ...valid, noticeVersion: "<script>" })).toBeNull();
    expect(validateConsentInput({ ...valid, purposes: [] })).toBeNull();
    expect(validateConsentInput(null)).toBeNull();
    expect(validateConsentInput("string")).toBeNull();
  });
});

describe("rate limiting public writes", () => {
  it("blocks once the window limit is reached", () => {
    resetRateLimits();
    const key = "test:1.2.3.4";
    for (let i = 0; i < 5; i += 1) {
      expect(rateLimit(key, 5, 60).ok).toBe(true);
    }
    const blocked = rateLimit(key, 5, 60);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("opens a new window after it expires", () => {
    resetRateLimits();
    const start = Date.now();
    expect(rateLimit("test:window", 1, 60, start).ok).toBe(true);
    expect(rateLimit("test:window", 1, 60, start + 1_000).ok).toBe(false);
    expect(rateLimit("test:window", 1, 60, start + 61_000).ok).toBe(true);
  });

  it("reads the client IP from proxy headers", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe(
      "9.9.9.9",
    );
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("legal notices", () => {
  it("versions every notice and exposes one combined version string", () => {
    for (const notice of legalNotices) {
      expect(notice.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(notice.body.length).toBeGreaterThan(0);
    }
    expect(NOTICE_VERSION_STRING).toContain("privacy@");
    expect(NOTICE_VERSION_STRING).toContain("terms@");
    expect(NOTICE_VERSION_STRING).toContain("cookies@");
  });

  it("ships the notices the DPDP rules and IT rules require", () => {
    const slugs = legalNotices.map((notice) => notice.slug);
    for (const required of ["privacy", "terms", "cookies", "ethics", "grievance"]) {
      expect(slugs).toContain(required);
    }
  });

  it("marks the drafts that still need a lawyer's review", () => {
    const privacy = legalNotices.find((notice) => notice.slug === "privacy")!;
    expect(privacy.draft).toBe(true);
  });
});
