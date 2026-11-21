import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { findById } from "./users";
import type { AdminUser } from "./rbac";

/**
 * Admin session — a signed, httpOnly cookie.
 *
 * Deliberately small: `userId.expiry.signature`. There is no state in the
 * cookie beyond the id, so changing a user's role takes effect on the next
 * request instead of being frozen into a token.
 *
 * The signing secret is required. Without `ADMIN_SESSION_SECRET` no session
 * can be issued or verified, so a misconfigured deploy locks the panel
 * instead of leaving it open (fail closed).
 */

export const SESSION_COOKIE = "ks_admin_session";
const MAX_AGE_SECONDS = 12 * 60 * 60; // 12h — matches the global security rule.

function secret(): string | null {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  return value && value.length >= 32 ? value : null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

export function createSessionValue(userId: string, now = Date.now()): string | null {
  const key = secret();
  if (!key) return null;
  const expiry = now + MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expiry}`;
  return `${payload}.${sign(payload, key)}`;
}

export function parseSessionValue(
  value: string | undefined,
  now = Date.now(),
): string | null {
  const key = secret();
  if (!key || !value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiryRaw, signature] = parts;

  const payload = `${userId}.${expiryRaw}`;
  const expected = Buffer.from(sign(payload, key), "hex");
  const given = Buffer.from(signature, "hex");

  if (given.length !== expected.length) return null;
  if (!timingSafeEqual(given, expected)) return null;

  const expiry = Number.parseInt(expiryRaw, 10);
  if (!Number.isFinite(expiry) || expiry < now) return null;

  return userId;
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

export function sessionConfigured(): boolean {
  return secret() !== null;
}

/** The signed-in user, or null. Reads the request cookie, so it is dynamic. */
export async function currentUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const userId = parseSessionValue(store.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return findById(userId);
}
