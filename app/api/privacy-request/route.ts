import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { site } from "@/lib/site";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/privacy-request — Data Principal rights requests (DPDP ss.11–14):
 * access, correction, erasure, nomination, withdrawal and grievances.
 *
 * Threat model: public write with personal data in the payload.
 * · abuse / flooding → 5 requests / hour per IP
 * · oversized payload → 8 KB cap
 * · invalid type → allow-list of request types
 * · impersonation → the request is only **acknowledged** here; identity is
 *   verified by the Grievance Officer before anything is disclosed or erased
 * · leakage → written to an append-only inbox file, never logged to stdout
 *
 * Development storage is a JSONL inbox; production must be the CMS grievance
 * inbox with access control (docs/known-gaps.md 🔴).
 */

const TYPES = [
  "access",
  "correction",
  "erasure",
  "nomination",
  "withdraw",
  "grievance",
] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const INBOX = path.join(process.cwd(), ".data", "privacy-requests.jsonl");

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`privacy:${ip}`, 5, 3600);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const raw = await request.text();
  if (raw.length > 8192) {
    return Response.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const type = body.type as (typeof TYPES)[number];
  if (!TYPES.includes(type)) {
    return Response.json({ ok: false, error: "invalid_type" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const details =
    typeof body.details === "string" ? body.details.trim().slice(0, 4000) : "";

  const ticket = `KS-${Date.now().toString(36).toUpperCase()}`;

  await mkdir(path.dirname(INBOX), { recursive: true });
  await appendFile(
    INBOX,
    JSON.stringify({
      ticket,
      type,
      email,
      details,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent"),
      createdAt: new Date().toISOString(),
      status: "received",
    }) + "\n",
    "utf8",
  );

  return Response.json(
    {
      ok: true,
      ticket,
      acknowledgeHours: site.legal.grievanceOfficer.acknowledgeHours,
      resolveDays: site.legal.grievanceOfficer.resolveDays,
    },
    { status: 202 },
  );
}
