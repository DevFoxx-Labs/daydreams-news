import { scryptSync, timingSafeEqual } from "node:crypto";

import type { AdminUser } from "./rbac";

/**
 * Newsroom accounts.
 *
 * Until the CMS lands (PRD M7) these live in memory so every role's dashboard
 * can actually be opened and reviewed. They are **development accounts**:
 *
 * - the password comes from `ADMIN_DEV_PASSWORD`; without it, sign-in is
 *   refused outright rather than falling back to a guessable default
 *   (fail-closed, global security rule),
 * - `NODE_ENV === 'production'` additionally requires `ADMIN_ALLOW_DEV_USERS`
 *   to be exactly "true", so a deploy can't accidentally ship them,
 * - passwords are verified with scrypt + a constant-time compare, never ==.
 *
 * Replacing this file with the CMS `users` table is the whole migration —
 * nothing else imports the account list.
 */

export type AdminAccount = AdminUser & { passwordHash: string };

const SALT = "daydreams-news-dev-accounts";

function hash(password: string): string {
  return scryptSync(password, SALT, 64).toString("hex");
}

/** Dev password, or null when the environment hasn't set one. */
function devPassword(): string | null {
  const value = process.env.ADMIN_DEV_PASSWORD?.trim();
  return value && value.length >= 8 ? value : null;
}

export function devUsersEnabled(): boolean {
  if (!devPassword()) return false;
  if (process.env.NODE_ENV === "production") {
    return process.env.ADMIN_ALLOW_DEV_USERS === "true";
  }
  return true;
}

type Seed = Omit<AdminAccount, "passwordHash">;

const SEEDS: Seed[] = [
  {
    id: "u-eic",
    name: "प्रधान संपादक (डेमो)",
    email: "editor@daydreamsnews.test",
    role: "editor_in_chief",
    scope: { kind: "global" },
    mfaEnabled: false,
  },
  {
    id: "u-desk",
    name: "डेस्क एडिटर (डेमो)",
    email: "desk@daydreamsnews.test",
    role: "desk_editor",
    scope: { kind: "global" },
    mfaEnabled: false,
  },
  {
    id: "u-reporter",
    name: "रिपोर्टर का नाम (डेमो)",
    email: "reporter@daydreamsnews.test",
    role: "reporter",
    scope: { kind: "own" },
    mfaEnabled: false,
  },
  {
    id: "u-stringer",
    name: "ज़िला संवाददाता (डेमो)",
    email: "stringer@daydreamsnews.test",
    role: "stringer",
    scope: { kind: "district", values: ["gaya"] },
    mfaEnabled: false,
  },
  {
    id: "u-bureau",
    name: "ब्यूरो चीफ, बिहार (डेमो)",
    email: "bureau@daydreamsnews.test",
    role: "bureau_chief",
    scope: { kind: "state", values: ["bihar"] },
    mfaEnabled: false,
  },
  {
    id: "u-grievance",
    name: "शिकायत निवारण अधिकारी (डेमो)",
    email: "grievance@daydreamsnews.test",
    role: "grievance",
    scope: { kind: "global" },
    mfaEnabled: false,
  },
  {
    id: "u-admin",
    name: "सिस्टम एडमिन (डेमो)",
    email: "admin@daydreamsnews.test",
    role: "admin",
    scope: { kind: "global" },
    mfaEnabled: false,
  },
];

function accounts(): AdminAccount[] {
  const password = devPassword();
  if (!password) return [];
  const passwordHash = hash(password);
  return SEEDS.map((seed) => ({ ...seed, passwordHash }));
}

export function listDemoAccounts(): Seed[] {
  return SEEDS;
}

export function findByEmail(email: string): AdminAccount | null {
  const normalised = email.trim().toLowerCase();
  return (
    accounts().find((account) => account.email.toLowerCase() === normalised) ??
    null
  );
}

export function findById(id: string): AdminUser | null {
  const account = accounts().find((entry) => entry.id === id);
  if (!account) return null;
  const { passwordHash: _passwordHash, ...user } = account;
  return user;
}

/** Constant-time password check. Returns the user, never a boolean + lookup. */
export function verifyCredentials(
  email: string,
  password: string,
): AdminUser | null {
  if (!devUsersEnabled()) return null;

  const account = findByEmail(email);
  const candidate = Buffer.from(hash(password), "hex");

  // Always compare against something of the same length so a missing account
  // and a wrong password take the same time (no user enumeration).
  const expected = Buffer.from(
    account?.passwordHash ?? hash("no-such-account-placeholder"),
    "hex",
  );

  const match =
    candidate.length === expected.length && timingSafeEqual(candidate, expected);

  if (!account || !match) return null;

  const { passwordHash: _passwordHash, ...user } = account;
  return user;
}
