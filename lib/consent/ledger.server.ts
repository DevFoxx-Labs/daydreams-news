import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import {
  CONSENT_PURPOSES,
  type ConsentMethod,
  type ConsentPurpose,
  type ConsentRecord,
  type ConsentStatus,
} from "./types";

/**
 * Append-only consent ledger (global rule §3).
 *
 * Rows are only ever appended — never updated or deleted, except when an
 * account is legally erased. This development implementation appends JSON
 * lines to `.data/consent-ledger.jsonl`, which is enough to prove the shape
 * and to test it, but is **not** production storage: see
 * `docs/known-gaps.md` (🔴) and `docs/owner-todo.md`. The CMS milestone moves
 * this to the `consent_records` Postgres table with the same columns.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const LEDGER_FILE = path.join(DATA_DIR, "consent-ledger.jsonl");

const VALID_METHODS: ConsentMethod[] = [
  "cookie_banner",
  "consent_settings",
  "signup_notice",
  "checkbox",
  "preferences",
];

const VALID_STATUSES: ConsentStatus[] = ["granted", "denied", "withdrawn"];

export type ConsentWriteInput = {
  visitorId: string;
  userId?: string | null;
  method: ConsentMethod;
  noticeVersion: string;
  purposes: { purpose: ConsentPurpose; status: ConsentStatus }[];
  ipAddress: string | null;
  userAgent: string | null;
};

/** Server-side allow-list validation — never trust the client payload. */
export function validateConsentInput(body: unknown): ConsentWriteInput | null {
  if (typeof body !== "object" || body === null) return null;
  const input = body as Record<string, unknown>;

  const visitorId = typeof input.visitorId === "string" ? input.visitorId : "";
  if (!/^[\w-]{8,64}$/.test(visitorId)) return null;

  const method = input.method as ConsentMethod;
  if (!VALID_METHODS.includes(method)) return null;

  const noticeVersion =
    typeof input.noticeVersion === "string" ? input.noticeVersion : "";
  if (!/^[\w@.;:-]{3,200}$/.test(noticeVersion)) return null;

  if (!Array.isArray(input.purposes) || input.purposes.length === 0) return null;
  if (input.purposes.length > CONSENT_PURPOSES.length) return null;

  const purposes: ConsentWriteInput["purposes"] = [];
  for (const entry of input.purposes) {
    if (typeof entry !== "object" || entry === null) return null;
    const { purpose, status } = entry as Record<string, unknown>;
    if (!CONSENT_PURPOSES.includes(purpose as ConsentPurpose)) return null;
    if (!VALID_STATUSES.includes(status as ConsentStatus)) return null;
    purposes.push({
      purpose: purpose as ConsentPurpose,
      status: status as ConsentStatus,
    });
  }

  return {
    visitorId,
    userId: null,
    method,
    noticeVersion,
    purposes,
    ipAddress: null,
    userAgent: null,
  };
}

function rowId(): string {
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function appendConsentRecords(
  input: ConsentWriteInput,
): Promise<ConsentRecord[]> {
  const createdAt = new Date().toISOString();
  const rows: ConsentRecord[] = input.purposes.map((entry) => ({
    id: rowId(),
    userId: input.userId ?? null,
    visitorId: input.visitorId,
    purpose: entry.purpose,
    status: entry.status,
    method: input.method,
    source: "web",
    noticeVersion: input.noticeVersion,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    createdAt,
  }));

  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(
    LEDGER_FILE,
    rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    "utf8",
  );

  return rows;
}

/** Used by the tests; there is no reader-facing endpoint for the whole ledger. */
export async function readConsentLedger(): Promise<ConsentRecord[]> {
  try {
    const raw = await readFile(LEDGER_FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as ConsentRecord);
  } catch {
    return [];
  }
}

export const LEDGER_PATH = LEDGER_FILE;
