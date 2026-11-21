import { describe, expect, it } from "vitest";

import {
  allow,
  can,
  inScope,
  permissionsOf,
  ROLE_META,
  ROLES,
  SENSITIVE_PERMISSIONS,
  type AdminUser,
} from "@/lib/admin/rbac";
import { IMPLEMENTED_ROUTES, NAV_CONFIG, isGroup, isSection } from "@/lib/admin/nav";
import {
  createSessionValue,
  parseSessionValue,
  sessionConfigured,
} from "@/lib/admin/session";
import { verifyCredentials } from "@/lib/admin/users";

const user = (over: Partial<AdminUser> = {}): AdminUser => ({
  id: "u-test",
  name: "टेस्ट",
  email: "test@khabarsetu.test",
  role: "reporter",
  scope: { kind: "own" },
  mfaEnabled: false,
  ...over,
});

describe("role model", () => {
  it("gives every role metadata and at least one permission", () => {
    for (const role of ROLES) {
      expect(ROLE_META[role]).toBeDefined();
      expect(permissionsOf(role).length).toBeGreaterThan(0);
    }
  });

  it("keeps ad sales away from editorial — the boundary is in code", () => {
    const sales = user({ role: "ad_sales", scope: { kind: "global" } });
    expect(can(sales, "story.edit.any")).toBe(false);
    expect(can(sales, "story.publish")).toBe(false);
    expect(can(sales, "story.create")).toBe(false);
  });

  it("stops reporters and stringers publishing", () => {
    expect(can(user({ role: "reporter" }), "story.publish")).toBe(false);
    expect(can(user({ role: "stringer" }), "story.publish")).toBe(false);
    expect(can(user({ role: "desk_editor" }), "story.publish")).toBe(true);
  });

  it("keeps reader personal data to compliance and break-glass admin", () => {
    for (const role of ROLES) {
      const allowed = can(user({ role }), "reader.pii.view");
      expect(allowed).toBe(role === "grievance" || role === "admin");
    }
  });

  it("lets only the grievance officer read the consent ledger", () => {
    const readers = ROLES.filter((role) =>
      can(user({ role }), "consent.ledger.view"),
    );
    expect(readers).toEqual(["grievance"]);
  });

  it("marks the destructive permissions as sensitive", () => {
    for (const permission of ["story.delete", "payout.approve", "user.manage"]) {
      expect(SENSITIVE_PERMISSIONS).toContain(permission);
    }
  });
});

describe("scope", () => {
  const bureau = user({
    role: "bureau_chief",
    scope: { kind: "state", values: ["bihar"] },
  });

  it("confines a bureau chief to their own state", () => {
    expect(inScope(bureau, { state: "bihar" })).toBe(true);
    expect(inScope(bureau, { state: "uttar-pradesh" })).toBe(false);
  });

  it("confines a stringer to their district", () => {
    const stringer = user({
      role: "stringer",
      scope: { kind: "district", values: ["gaya"] },
    });
    expect(inScope(stringer, { city: "gaya" })).toBe(true);
    expect(inScope(stringer, { city: "patna" })).toBe(false);
  });

  it("confines an `own` scope to the user's own records", () => {
    const reporter = user({ id: "u-9" });
    expect(inScope(reporter, { ownerId: "u-9" })).toBe(true);
    expect(inScope(reporter, { ownerId: "u-8" })).toBe(false);
  });

  it("requires permission AND scope together", () => {
    // Has the permission, wrong state.
    expect(allow(bureau, "story.publish", { state: "uttar-pradesh" })).toBe(false);
    expect(allow(bureau, "story.publish", { state: "bihar" })).toBe(true);
    // Right state, no such permission.
    expect(allow(bureau, "settings.manage", { state: "bihar" })).toBe(false);
  });

  it("denies everything for a signed-out user", () => {
    expect(can(null, "story.create")).toBe(false);
    expect(allow(null, "story.create")).toBe(false);
    expect(inScope(null, { state: "bihar" })).toBe(false);
  });
});

describe("navigation config", () => {
  it("gives every role a menu that starts with the dashboard", () => {
    for (const role of ROLES) {
      const items = NAV_CONFIG[role];
      expect(items.length).toBeGreaterThan(2);
      const first = items[0];
      expect(isSection(first)).toBe(false);
      expect(isGroup(first)).toBe(false);
    }
  });

  it("never nests deeper than two levels", () => {
    for (const role of ROLES) {
      for (const item of NAV_CONFIG[role]) {
        if (!isGroup(item)) continue;
        for (const child of item.children) {
          expect("children" in child).toBe(false);
        }
      }
    }
  });

  it("only links routes that exist", () => {
    for (const role of ROLES) {
      for (const item of NAV_CONFIG[role]) {
        if (isSection(item)) continue;
        const leaves = isGroup(item) ? item.children : [item];
        for (const leaf of leaves) {
          expect(leaf.href.startsWith("/admin")).toBe(true);
        }
      }
    }
    // Every implemented route is reachable from at least one role's menu.
    const linked = new Set<string>();
    for (const role of ROLES) {
      for (const item of NAV_CONFIG[role]) {
        if (isSection(item)) continue;
        const leaves = isGroup(item) ? item.children : [item];
        for (const leaf of leaves) linked.add(leaf.href.split("?")[0]);
      }
    }
    for (const route of IMPLEMENTED_ROUTES) {
      if (route === "/admin/profile" || route === "/admin") continue;
      expect(linked.has(route)).toBe(true);
    }
  });
});

describe("session cookie", () => {
  const ORIGINAL = process.env.ADMIN_SESSION_SECRET;

  it("fails closed without a secret", () => {
    delete process.env.ADMIN_SESSION_SECRET;
    expect(sessionConfigured()).toBe(false);
    expect(createSessionValue("u-1")).toBeNull();
    expect(parseSessionValue("u-1.9999999999999.deadbeef")).toBeNull();
    process.env.ADMIN_SESSION_SECRET = ORIGINAL;
  });

  it("round-trips a signed session and rejects tampering", () => {
    process.env.ADMIN_SESSION_SECRET = "x".repeat(40);
    const value = createSessionValue("u-42")!;
    expect(parseSessionValue(value)).toBe("u-42");

    // Swapping the user id invalidates the signature.
    const [, expiry, signature] = value.split(".");
    expect(parseSessionValue(`u-99.${expiry}.${signature}`)).toBeNull();
    expect(parseSessionValue("garbage")).toBeNull();
    expect(parseSessionValue(undefined)).toBeNull();
    process.env.ADMIN_SESSION_SECRET = ORIGINAL;
  });

  it("rejects an expired session", () => {
    process.env.ADMIN_SESSION_SECRET = "y".repeat(40);
    const issued = createSessionValue("u-7", Date.now() - 13 * 60 * 60 * 1000)!;
    expect(parseSessionValue(issued)).toBeNull();
    process.env.ADMIN_SESSION_SECRET = ORIGINAL;
  });
});

describe("credentials", () => {
  const ORIGINAL = process.env.ADMIN_DEV_PASSWORD;

  it("refuses every sign-in when no dev password is configured", () => {
    delete process.env.ADMIN_DEV_PASSWORD;
    expect(verifyCredentials("desk@khabarsetu.test", "anything")).toBeNull();
    process.env.ADMIN_DEV_PASSWORD = ORIGINAL;
  });

  it("accepts the configured password and rejects a wrong one", () => {
    process.env.ADMIN_DEV_PASSWORD = "test-password-123";
    expect(verifyCredentials("desk@khabarsetu.test", "test-password-123")?.role).toBe(
      "desk_editor",
    );
    expect(verifyCredentials("desk@khabarsetu.test", "wrong")).toBeNull();
    expect(verifyCredentials("nobody@khabarsetu.test", "test-password-123")).toBeNull();
    process.env.ADMIN_DEV_PASSWORD = ORIGINAL;
  });
});
